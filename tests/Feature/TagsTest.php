<?php

use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;
use Shah\Novus\Models\Post;
use Shah\Novus\Models\Tag;

beforeEach(function () {
    $this->actingAsAuthor();
    $this->withoutVite();
});

test('index page shows all tags', function () {
    Tag::factory()->count(3)->create();

    $this->get(route('novus.tags.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('Tags/Management')
                ->has('tags.data', 3)
                ->has(
                    'filters',
                    fn (Assert $page) => $page
                        ->has('search')
                        ->has('sort_by')
                        ->has('sort_direction')
                        ->has('per_page')
                )
        );
});

test('index page with search', function () {
    Tag::factory()->create(['name' => 'Laravel']);
    Tag::factory()->create(['name' => 'PHP']);
    Tag::factory()->create(['name' => 'JavaScript']);

    $this->get(route('novus.tags.index', ['search' => 'Laravel']))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('Tags/Management')
                ->has('tags.data', 1)
                ->where('tags.data.0.name', 'Laravel')
        );
});

test('index page with sorting', function () {
    Tag::factory()->create(['name' => 'B']);
    Tag::factory()->create(['name' => 'A']);
    Tag::factory()->create(['name' => 'C']);

    $this->get(route('novus.tags.index', [
        'sort_by' => 'name',
        'sort_direction' => 'asc',
    ]))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('Tags/Management')
                ->where('tags.data.0.name', 'A')
                ->where('tags.data.1.name', 'B')
                ->where('tags.data.2.name', 'C')
        );
});

test('can create a new tag', function () {
    $data = [
        'name' => 'Test Tag',
        'slug' => 'test-tag',
    ];

    $this->post(route('novus.tags.store'), $data)
        ->assertRedirect(route('novus.tags.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('novus_tags', [
        'name' => $data['name'],
        'slug' => $data['slug'],
    ]);
});

test('slug is auto-generated if not provided', function () {
    $data = [
        'name' => 'Test Tag Name',
    ];

    $this->post(route('novus.tags.store'), $data)
        ->assertRedirect(route('novus.tags.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('novus_tags', [
        'name' => $data['name'],
        'slug' => 'test-tag-name',
    ]);
});

test('can update a tag', function () {
    $tag = Tag::factory()->create();

    $data = [
        'name' => 'Updated Tag Name',
        'slug' => 'updated-tag-name',
    ];

    $this->patch(route('novus.tags.update', $tag), $data)
        ->assertRedirect(route('novus.tags.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('novus_tags', [
        'id' => $tag->id,
        'name' => $data['name'],
        'slug' => $data['slug'],
    ]);
});

test('can delete a tag', function () {
    $tag = Tag::factory()->create();

    $this->delete(route('novus.tags.destroy', $tag))
        ->assertRedirect(route('novus.tags.index'))
        ->assertSessionHas('success');

    $this->assertSoftDeleted('novus_tags', [
        'id' => $tag->id,
    ]);
});

test('can bulk delete tags', function () {
    $tags = Tag::factory()->count(3)->create();

    $this->delete(route('novus.tags.bulk-destroy'), [
        'tag_ids' => $tags->pluck('id')->toArray(),
    ])
        ->assertRedirect(route('novus.tags.index'))
        ->assertSessionHas('success');

    foreach ($tags as $tag) {
        $this->assertSoftDeleted('novus_tags', [
            'id' => $tag->id,
        ]);
    }
});

test('can export tags to CSV', function () {
    $tags = Tag::factory()->count(2)->create();

    $response = $this->get(route('novus.tags.export'))
        ->assertOk()
        ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

    $content = $response->streamedContent();
    $rows = str_getcsv($content, "\n");
    $this->assertEquals('ID,Name,Slug,"Posts Count","Created At"', $rows[0]);

    foreach ($tags as $index => $tag) {
        $row = str_getcsv($rows[$index + 1]);
        $this->assertEquals($tag->id, $row[0]);
        $this->assertEquals($tag->name, $row[1]);
        $this->assertEquals($tag->slug, $row[2]);
        $this->assertEquals('0', $row[3]); // Posts count
    }
});

test('can import tags from CSV', function () {
    $csv = "Name,Slug\nTest Tag,test-tag\nAnother Tag,another-tag";
    $file = UploadedFile::fake()->createWithContent('tags.csv', $csv);

    $this->post(route('novus.tags.import'), [
        'csv_file' => $file,
    ])
        ->assertRedirect(route('novus.tags.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('novus_tags', [
        'name' => 'Test Tag',
        'slug' => 'test-tag',
    ]);

    $this->assertDatabaseHas('novus_tags', [
        'name' => 'Another Tag',
        'slug' => 'another-tag',
    ]);
});

test('validation fails with invalid data', function () {
    $data = [
        'name' => '', // Empty name
        'slug' => 'test-tag',
    ];

    $this->post(route('novus.tags.store'), $data)
        ->assertSessionHasErrors(['name']);
});

test('cannot create tag with duplicate slug', function () {
    Tag::factory()->create(['slug' => 'test-tag']);

    $data = [
        'name' => 'Another Tag',
        'slug' => 'test-tag', // Duplicate slug
    ];

    $this->post(route('novus.tags.store'), $data)
        ->assertSessionHasErrors(['slug']);
});

test('deleting tag detaches it from posts', function () {
    $tag = Tag::factory()->create();
    $post = Post::factory()->create();
    $post->tags()->attach($tag);

    $this->delete(route('novus.tags.destroy', $tag));

    $this->assertDatabaseMissing('novus_taggables', [
        'tag_id' => $tag->id,
        'taggable_id' => $post->id,
        'taggable_type' => Post::class,
    ]);
});
