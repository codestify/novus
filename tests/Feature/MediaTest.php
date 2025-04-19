<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Shah\Novus\Models\Media;

beforeEach(function () {
    $this->actingAsAuthor();
    $this->withoutVite();
    Storage::fake('public');
});

test('index page shows all media', function () {
    // Create 3 media items
    Media::factory()->count(3)->create(['type' => 0]);

    $this->get(route('novus.media.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('Media/Index')
                ->has('media.data', 3)
                ->has(
                    'filters',
                    fn (Assert $page) => $page
                        ->has('search')
                        ->has('collection')
                        ->has('mime_type')
                        ->has('sort_by')
                        ->has('per_page')
                )
        );
});

test('index page with search', function () {
    $media = Media::factory()->create([
        'name' => 'Test Image',
        'type' => 0,
    ]);

    $this->get(route('novus.media.index', ['search' => 'Test']))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('Media/Index')
                ->has('media.data', 1)
                ->where('media.data.0.name', 'Test Image')
        );
});

test('index page with collection filter', function () {
    // Create 2 media items in the 'banners' collection
    Media::factory()->count(2)->create([
        'collection_name' => 'banners',
        'type' => 0,
    ]);

    $this->get(route('novus.media.index', ['collection' => 'banners']))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('Media/Index')
                ->has('media.data', 2)
                ->where('media.data.0.collection_name', 'banners')
                ->where('media.data.1.collection_name', 'banners')
        );
});

test('can upload a new image', function () {
    $file = UploadedFile::fake()->image('test.jpg');

    $response = $this->post(route('novus.media.upload'), [
        'file' => $file,
        'collection_name' => 'test',
    ]);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'message' => 'File uploaded successfully',
        ])
        ->assertJsonStructure([
            'media' => [
                'id',
                'name',
                'path',
                'url',
                'mime_type',
                'type',
                'disk',
                'collection_name',
                'size',
            ],
        ]);

    $this->assertDatabaseHas('novus_media', [
        'name' => 'test',
        'collection_name' => 'test',
    ]);

    $this->assertTrue(Storage::disk('public')->exists('novus-media/'.date('Y/m/d').'/test.jpg'));
});

test('upload fails with non-image file', function () {
    $file = UploadedFile::fake()->create('test.txt', 100);

    $response = $this->post(route('novus.media.upload'), [
        'file' => $file,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['file']);
});

test('upload fails with file too large', function () {
    $file = UploadedFile::fake()->image('test.jpg')->size(10241); // 10MB + 1KB

    $response = $this->post(route('novus.media.upload'), [
        'file' => $file,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['file']);
});

test('can update media details', function () {
    $media = Media::factory()->create();

    $response = $this->patch(route('novus.media.update', $media), [
        'name' => 'Updated Name',
        'alt_text' => 'Updated Alt Text',
        'title' => 'Updated Title',
        'collection_name' => 'updated',
        'custom_properties' => ['width' => 100, 'height' => 100],
    ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('novus_media', [
        'id' => $media->id,
        'name' => 'Updated Name',
        'alt_text' => 'Updated Alt Text',
        'title' => 'Updated Title',
        'collection_name' => 'updated',
    ]);
});

test('can delete a media item', function () {
    $media = Media::factory()->create();

    $response = $this->delete(route('novus.media.destroy', $media));

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertSoftDeleted('novus_media', [
        'id' => $media->id,
    ]);
});

test('can bulk delete media items', function () {
    $media1 = Media::factory()->create();
    $media2 = Media::factory()->create();
    $ids = [$media1->id, $media2->id];

    $response = $this->post(route('novus.media.bulk-destroy'), [
        'ids' => $ids,
    ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    foreach ($ids as $id) {
        $this->assertSoftDeleted('novus_media', [
            'id' => $id,
        ]);
    }
});

test('bulk delete validation fails with invalid ids', function () {
    $response = $this->post(route('novus.media.bulk-destroy'), [
        'ids' => ['invalid'],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['ids.0']);
});

test('can show media details', function () {
    $media = Media::factory()->create();

    $response = $this->get(route('novus.media.show', $media));

    $response->assertOk()
        ->assertJsonStructure([
            'id',
            'name',
            'path',
            'url',
            'mime_type',
            'type',
            'disk',
            'collection_name',
            'size',
        ]);
});
