<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Shah\Novus\Models\Media;
use Shah\Novus\Models\Post;

beforeEach(function () {
    // Create fake storage disk for testing
    Storage::fake('public');
    $this->withoutVite();
});

it('can add and remove a featured image from a post', function () {
    // Create an author for the test
    $author = $this->actingAsAuthor();

    // Create a post with sufficient content for validation
    $post = Post::factory()->create([
        'content' => 'This is a test post with enough content to meet validation rules.',
        'slug' => 'test-post-'.Str::random(10), // Ensure unique slug
        'author_id' => $author->id,
    ]);

    // Create a media item directly
    $media = Media::create([
        'name' => 'test-image.jpg',
        'path' => 'test-path/test-image.jpg',
        'mime_type' => 'image/jpeg',
        'type' => 0, // Assuming 0 is for image type
        'disk' => 'public',
        'size' => 100000,
        'alt_text' => 'Test image',
        'title' => 'Test image',
    ]);

    // Attach media to post as featured image
    $post->media()->attach($media->id, [
        'collection_name' => 'featured_image',
        'order_column' => 1,
    ]);

    // Reload the post with media
    $post->refresh();
    $post->load('media');

    // Verify the featured image was attached
    expect($post->media)->toHaveCount(1);
    expect($post->media->first()->pivot->collection_name)->toBe('featured_image');

    // Now detach the featured image
    $post->media()->wherePivot('collection_name', 'featured_image')->detach();

    // Reload the post with media
    $post->refresh();
    $post->load('media');

    // Verify the featured image was removed
    expect($post->media->where('pivot.collection_name', 'featured_image'))->toHaveCount(0);
});
