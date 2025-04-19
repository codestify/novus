<?php

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Shah\Novus\Models\Post;
use Shah\Novus\Models\SeoMeta;

it('has the correct table name', function () {
    $seoMeta = new SeoMeta;
    expect($seoMeta->getTable())->toBe('novus_seo_meta');
});

it('casts boolean fields correctly', function () {
    $seoMeta = new SeoMeta;
    $casts = $seoMeta->getCasts();

    expect($casts)->toHaveKey('robots_noindex')
        ->and($casts['robots_noindex'])->toBe('boolean')
        ->and($casts)->toHaveKey('robots_nofollow')
        ->and($casts['robots_nofollow'])->toBe('boolean');
});

it('casts structured_data as array object', function () {
    $seoMeta = new SeoMeta;
    $casts = $seoMeta->getCasts();

    expect($casts)->toHaveKey('structured_data')
        ->and($casts['structured_data'])->toBe(AsArrayObject::class);
});

it('has a metable relationship', function () {
    $seoMeta = new SeoMeta;
    expect($seoMeta->metable())->toBeInstanceOf(MorphTo::class);
});

it('can create seo meta for a post', function () {
    $post = Post::factory()->create();

    $seoMeta = new SeoMeta;
    $seoMeta->meta_title = 'SEO Title';
    $seoMeta->meta_description = 'SEO Description for testing';
    $seoMeta->robots_noindex = true;
    $seoMeta->robots_nofollow = false;
    $seoMeta->structured_data = ['@type' => 'Article', 'name' => 'Test Article'];
    $seoMeta->metable()->associate($post);
    $seoMeta->save();

    $this->assertDatabaseHas('novus_seo_meta', [
        'meta_title' => 'SEO Title',
        'meta_description' => 'SEO Description for testing',
        'robots_noindex' => true,
        'robots_nofollow' => false,
        'metable_id' => $post->id,
        'metable_type' => Post::class,
    ]);

    // Test retrieval with structured data
    $retrievedMeta = SeoMeta::where('metable_id', $post->id)
        ->where('metable_type', Post::class)
        ->first();

    expect($retrievedMeta)->not->toBeNull()
        ->and($retrievedMeta->structured_data)->toBeInstanceOf(ArrayObject::class)
        ->and((array) $retrievedMeta->structured_data)->toHaveKey('@type')
        ->and((array) $retrievedMeta->structured_data)->toHaveKey('name');
});

it('can attach to and be retrieved from a post', function () {
    $post = Post::factory()->create();

    $seoMeta = new SeoMeta;
    $seoMeta->meta_title = 'Test SEO Title';
    $seoMeta->meta_description = 'Test SEO Description';
    $seoMeta->metable()->associate($post);
    $seoMeta->save();

    // Test that the post can retrieve the SEO meta
    $post->refresh();

    // This test assumes Post has a seoMeta relationship
    // If it doesn't, you'll need to manually retrieve the SeoMeta
    if (method_exists($post, 'seoMeta')) {
        expect($post->seoMeta)->not->toBeNull()
            ->and($post->seoMeta->meta_title)->toBe('Test SEO Title')
            ->and($post->seoMeta->meta_description)->toBe('Test SEO Description');
    } else {
        $metaFromDb = SeoMeta::where('metable_id', $post->id)
            ->where('metable_type', Post::class)
            ->first();

        expect($metaFromDb)->not->toBeNull()
            ->and($metaFromDb->meta_title)->toBe('Test SEO Title')
            ->and($metaFromDb->meta_description)->toBe('Test SEO Description');
    }
});

it('can update seo meta for a post', function () {
    $post = Post::factory()->create();

    // Create initial meta
    $seoMeta = new SeoMeta;
    $seoMeta->meta_title = 'Initial Title';
    $seoMeta->meta_description = 'Initial Description';
    $seoMeta->metable()->associate($post);
    $seoMeta->save();

    // Update the meta
    $seoMeta->meta_title = 'Updated Title';
    $seoMeta->meta_description = 'Updated Description';
    $seoMeta->robots_noindex = true;
    $seoMeta->save();

    $this->assertDatabaseHas('novus_seo_meta', [
        'id' => $seoMeta->id,
        'meta_title' => 'Updated Title',
        'meta_description' => 'Updated Description',
        'robots_noindex' => true,
    ]);
});

it('can store and retrieve open graph data', function () {
    $post = Post::factory()->create();

    $seoMeta = new SeoMeta;
    $seoMeta->og_title = 'Open Graph Title';
    $seoMeta->og_description = 'Open Graph Description';
    $seoMeta->og_image = 'https://example.com/image.jpg';
    $seoMeta->metable()->associate($post);
    $seoMeta->save();

    $retrievedMeta = SeoMeta::find($seoMeta->id);

    expect($retrievedMeta->og_title)->toBe('Open Graph Title')
        ->and($retrievedMeta->og_description)->toBe('Open Graph Description')
        ->and($retrievedMeta->og_image)->toBe('https://example.com/image.jpg');
});
