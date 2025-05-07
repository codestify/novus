<?php

use Carbon\Carbon;
use Shah\Novus\Enums\PostStatus;
use Shah\Novus\Models\Post;

use function Pest\Laravel\patch;

beforeEach(function () {
    Carbon::setTestNow();
    $this->actingAsAuthor();
    $this->withoutVite();
});

test('draft post with future date should become scheduled', function () {
    // Arrange
    $post = Post::factory()->create([
        'status' => PostStatus::Draft->value,
        'published_at' => null,
    ]);

    $futureDate = Carbon::now()->addDays(2)->toDateTimeString();
    patch(route('novus.posts.update', $post), [
        'title' => 'Test Post',
        'slug' => 'test-post',
        'content' => 'This is test content with more than 20 characters',
        'status' => PostStatus::from(PostStatus::Draft->value)->label(),
        'published_at' => $futureDate,
    ]);

    $post->refresh();

    expect($post->status->value)->toBe(PostStatus::Scheduled->value)
        ->and($post->published_at->toDateTimeString())->toBe($futureDate);
});

test('published post with future date should become Schedule', function () {
    $post = Post::factory()->create([
        'status' => PostStatus::Published->value,
        'published_at' => Carbon::now()->subDay(),
    ]);

    $futureDate = Carbon::now()->addDays(2)->toDateTimeString();
    patch(route('novus.posts.update', $post), [
        'title' => 'Test Post',
        'slug' => 'test-post',
        'content' => 'This is test content with more than 20 characters',
        'published_at' => $futureDate,
    ]);

    $post->refresh();
    expect($post->status->value)->toBe(PostStatus::Scheduled->value)
        ->and($post->published_at->toDateTimeString())->toBe($futureDate);
});

test('scheduled post with past date should become published', function () {
    $post = Post::factory()->create([
        'status' => PostStatus::Scheduled->value,
        'published_at' => Carbon::now()->addDays(2),
    ]);

    $pastDate = Carbon::now()->subDay()->toDateTimeString();
    patch(route('novus.posts.update', $post), [
        'title' => 'Test Post',
        'slug' => 'test-post',
        'content' => 'This is test content with more than 20 characters',
        'published_at' => $pastDate,
    ]);

    $post->refresh();
    expect($post->status->value)->toBe(PostStatus::Published->value);
});

test('draft post without publish date remains draft', function () {
    $post = Post::factory()->create([
        'status' => PostStatus::Draft->value,
        'published_at' => null,
    ]);

    patch(route('novus.posts.update', $post), [
        'title' => 'Test Post',
        'slug' => 'test-post',
        'content' => 'This is test content with more than 20 characters',
        'status' => PostStatus::Draft->value,
    ]);

    // Assert
    $post->refresh();
    expect($post->status->value)->toBe(PostStatus::Draft->value)
        ->and($post->published_at)->toBeNull();
});

test('scheduled post keeps future date when updating other fields', function () {
    $futureDate = Carbon::now()->addDays(2)->toDateTimeString();
    $post = Post::factory()->create([
        'status' => PostStatus::Scheduled->value,
        'published_at' => $futureDate,
    ]);

    patch(route('novus.posts.update', $post), [
        'title' => 'Updated Test Post',
        'slug' => 'updated-test-post',
        'content' => 'This is updated test content with more than 20 characters',
        'status' => PostStatus::Scheduled->value,
    ]);

    $post->refresh();
    expect($post->status->value)->toBe(PostStatus::Scheduled->value)
        ->and($post->published_at->toDateTimeString())->toBe($futureDate)
        ->and($post->title)->toBe('Updated Test Post');
});
