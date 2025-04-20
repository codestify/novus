<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Authors table - acts as the user authentication table for authors
        Schema::create('novus_authors', function (Blueprint $table) {
            $table->id();
            $table->ulid()->index();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('bio')->nullable();
            $table->string('email')->unique(); // Made email required and unique for authentication
            $table->string('password');
            $table->string('website')->nullable();
            $table->string('avatar')->nullable();
            $table->json('social_links')->nullable();
            $table->rememberToken(); // For "remember me" functionality
            $table->timestamp('email_verified_at')->nullable(); // For email verification
            $table->timestamps();
            $table->softDeletes();

            // Added indexes for auth queries
            $table->index('email');
        });

        // Posts table
        Schema::create('novus_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 191);
            $table->string('slug', 191)->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->longText('content_html')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('status')->default(true); // 0 = draft, 1 = published, 2 = archived, 3 = trashed, 4 = scheduled
            $table->foreignId('author_id')->nullable()->references('id')->on('novus_authors')->nullOnDelete();
            $table->string('post_type')->default('post'); // post, page, etc.
            $table->string('template')->nullable(); // for page templates
            $table->timestamps();
            $table->softDeletes();

            $table->index('published_at');
            $table->index('is_featured');
            $table->index(['is_draft', 'published_at']);
            $table->index('post_type');
        });

        // Categories table
        Schema::create('novus_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id', 'novus_cat_parent_foreign')->references('id')->on('novus_categories')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('parent_id');
        });

        // Category relationships (polymorphic for posts)
        // Added back to properly handle many-to-many category relationships
        Schema::create('novus_categorizables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('novus_categories')->cascadeOnDelete();
            $table->morphs('categorizable');
            $table->unique(['category_id', 'categorizable_id', 'categorizable_type'], 'novus_categorizables_unique');
            $table->timestamps();

            $table->index(['categorizable_id', 'categorizable_type']);
        });

        // Tags table - fixed to remove taggable columns from main table
        Schema::create('novus_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        // Taggables pivot table - added back for proper many-to-many relationship
        Schema::create('novus_taggables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tag_id')->constrained('novus_tags')->cascadeOnDelete();
            $table->morphs('taggable');
            $table->unique(['tag_id', 'taggable_id', 'taggable_type'], 'novus_taggables_unique');
            $table->timestamps();

            $table->index(['taggable_id', 'taggable_type']);
        });

        // SEO Meta table (polymorphic for all content types)
        Schema::create('novus_seo_meta', function (Blueprint $table) {
            $table->id();
            $table->morphs('metable'); // Can be attached to any model
            $table->string('meta_title', 191)->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('og_title', 191)->nullable(); // Open Graph title
            $table->text('og_description')->nullable(); // Open Graph description
            $table->string('og_image')->nullable(); // Open Graph image
            $table->string('og_type')->nullable(); // Open Graph type
            $table->string('twitter_title', 191)->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();
            $table->string('twitter_card')->default('summary_large_image');
            $table->boolean('robots_noindex')->default(false);
            $table->boolean('robots_nofollow')->default(false);
            $table->json('structured_data')->nullable(); // JSON-LD structured data
            $table->timestamps();

            $table->index(['metable_id', 'metable_type']);
            $table->unique(['metable_id', 'metable_type'], 'novus_seo_meta_unique');
        });

        // Media table for all attachable files
        Schema::create('novus_media', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // name of the file or video
            $table->string('path'); // path to the file on disk or URL for videos
            $table->string('mime_type');
            $table->tinyInteger('type')->default(0); // 0 = image, 1 = video, 2 = audio, etc.
            $table->string('disk')->default('public');
            $table->string('collection_name')->nullable();
            $table->unsignedBigInteger('size');
            $table->json('custom_properties')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('title')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('collection_name');
            $table->index('mime_type');
            $table->index('type'); // Added index for the type field since it will be frequently queried
        });

        // Mediables pivot table for polymorphic relationships
        Schema::create('novus_mediables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_id')->constrained('novus_media')->cascadeOnDelete();
            $table->morphs('mediable');
            $table->string('collection_name')->nullable();
            $table->integer('order_column')->nullable();
            $table->unique(['media_id', 'mediable_id', 'mediable_type', 'collection_name'], 'novus_mediables_unique');
            $table->timestamps();

            $table->index(['mediable_id', 'mediable_type']);
            $table->index('collection_name');
        });

        Schema::create('novus_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('status')->default('active');
            $table->json('preferences')->nullable();
            $table->timestamp('subscribed_at');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Fixed to only drop tables that exist in this migration
        Schema::dropIfExists('novus_mediables');
        Schema::dropIfExists('novus_media');
        Schema::dropIfExists('novus_taggables');
        Schema::dropIfExists('novus_tags');
        Schema::dropIfExists('novus_categorizables');
        Schema::dropIfExists('novus_seo_meta');
        Schema::dropIfExists('novus_categories');
        Schema::dropIfExists('novus_posts');
        Schema::dropIfExists('novus_authors');
        Schema::dropIfExists('novus_subscribers');
    }
};
