<?php

namespace Shah\Novus\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Shah\Novus\Enums\PostStatus;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'novus_posts';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'status' => PostStatus::class,
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'is_featured' => false,
        'status' => 1, // Draft by default
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'content_html',
        'published_at',
        'is_featured',
        'status',
        'author_id',
    ];

    /**
     * Get the post's author.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    /**
     * Get the categories for the post.
     */
    public function categories(): MorphToMany
    {
        return $this->morphToMany(Category::class, 'categorizable', 'novus_categorizables');
    }

    /**
     * Get the tags for the post.
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable', 'novus_taggables');
    }

    /**
     * Get the post's SEO meta data.
     */
    public function seoMeta(): MorphOne
    {
        return $this->morphOne(SeoMeta::class, 'metable');
    }

    /**
     * Get the media attached to the post.
     */
    public function media(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable', 'novus_mediables')
            ->withPivot('collection_name', 'order_column');
    }

    /**
     * Determine if the post is published.
     */
    protected function isPublished(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->published_at && $this->published_at->isPast(),
        );
    }

    /**
     * Get the post's content as HTML.
     */
    protected function contentHtml(): Attribute
    {
        return Attribute::make(
            get: fn (string $value, array $attributes) => $value ?: $this->convertToHtml($attributes['content']),
            set: fn (string $value) => $value,
        );
    }

    /**
     * Convert markdown content to HTML.
     */
    private function convertToHtml(string $content): string
    {
        // This would contain markdown parsing logic
        return $content;
    }
}
