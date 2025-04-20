<?php

use Shah\Novus\Models\Category;
use Shah\Novus\Models\Post;

// Add a beforeEach function to apply withoutVite to all tests
beforeEach(function () {
    $this->withoutVite();
});

test('guest cannot access categories', function () {
    $this->get(route('novus.categories.index'))
        ->assertRedirect(route('novus.auth.login'));
});

test('author can view categories index', function () {
    $this->actingAsAuthor();

    $categories = Category::factory()->count(3)->create();
    $categories = $categories->sortBy('name')->values()->all();

    $this->get(route('novus.categories.index'))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('Categories/Index')
                ->has('categories.data', 3)
                ->where('categories.data.0.name', $categories[0]->name)
                ->where('categories.data.1.name', $categories[1]->name)
                ->where('categories.data.2.name', $categories[2]->name)
        );
});

test('author can view create category form', function () {
    $this->actingAsAuthor();

    $parentCategories = Category::factory()->count(2)->create();
    $parentCategories = $parentCategories->sortBy('name')->values()->all();

    $this->get(route('novus.categories.create'))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('Categories/Create')
                ->has('parentCategories', 2)
                ->where('parentCategories.0.name', $parentCategories[0]->name)
                ->where('parentCategories.1.name', $parentCategories[1]->name)
        );
});

test('author can create a new category', function () {
    $this->actingAsAuthor();

    $parentCategory = Category::factory()->create();

    $this->post(route('novus.categories.store'), [
        'name' => 'Test Category',
        'slug' => 'test-category',
        'description' => 'Test category description',
        'parent_id' => $parentCategory->id,
        'seo' => [
            'meta_title' => 'SEO Title',
            'meta_description' => 'SEO Description',
            'meta_keywords' => 'seo, keywords',
        ],
    ])
        ->assertRedirect(route('novus.categories.index'))
        ->assertSessionHas('success', 'Category created successfully.');

    $this->assertDatabaseHas('novus_categories', [
        'name' => 'Test Category',
        'slug' => 'test-category',
        'description' => 'Test category description',
        'parent_id' => $parentCategory->id,
    ]);

    $this->assertDatabaseHas('novus_seo_meta', [
        'meta_title' => 'SEO Title',
        'meta_description' => 'SEO Description',
        'meta_keywords' => 'seo, keywords',
    ]);
});

test('author can view edit category form', function () {
    $this->actingAsAuthor();

    $category = Category::factory()->create();
    Category::factory()->count(2)->create();

    $this->get(route('novus.categories.edit', $category))
        ->assertOk()
        ->assertInertia(
            fn ($page) => $page
                ->component('Categories/Edit')
                ->where('category.id', $category->id)
                ->where('category.name', $category->name)
                ->has('parent_categories', 2)
        );
});

test('author can update a category', function () {
    $this->actingAsAuthor();

    $category = Category::factory()->create();
    $newParent = Category::factory()->create();

    $this->patch(route('novus.categories.update', $category), [
        'name' => 'Updated Category',
        'slug' => 'updated-category',
        'description' => 'Updated description',
        'parent_id' => $newParent->id,
        'seo' => [
            'meta_title' => 'Updated SEO Title',
            'meta_description' => 'Updated SEO Description',
            'meta_keywords' => 'updated, keywords',
        ],
    ])
        ->assertRedirect(route('novus.categories.edit', $category->id))
        ->assertSessionHas('success', 'Category updated successfully.');

    $this->assertDatabaseHas('novus_categories', [
        'id' => $category->id,
        'name' => 'Updated Category',
        'slug' => 'updated-category',
        'description' => 'Updated description',
        'parent_id' => $newParent->id,
    ]);
});

test('author cannot delete category with associated posts', function () {
    $this->actingAsAuthor();

    $category = Category::factory()->create();
    $post = Post::factory()->create();

    $post->categories()->attach($category);

    $this->delete(route('novus.categories.destroy', $category))
        ->assertRedirect(route('novus.categories.index'))
        ->assertSessionHas('error', 'Cannot delete category with associated posts or child categories.');

    $this->assertDatabaseHas('novus_categories', [
        'id' => $category->id,
    ]);
});

test('author cannot delete category with child categories', function () {
    $this->actingAsAuthor();

    $parentCategory = Category::factory()->create();
    Category::factory()->create(['parent_id' => $parentCategory->id]);

    $this->delete(route('novus.categories.destroy', $parentCategory))
        ->assertRedirect(route('novus.categories.index'))
        ->assertSessionHas('error', 'Cannot delete category with associated posts or child categories.');

    $this->assertDatabaseHas('novus_categories', [
        'id' => $parentCategory->id,
    ]);
});

test('author can delete category without posts or children', function () {
    $this->actingAsAuthor();
    $category = Category::factory()->create();
    $categoryToDelete = Category::factory()->create();

    $this->assertEquals(Category::all()->count(), 2);

    $this->delete(route('novus.categories.destroy', $categoryToDelete))
        ->assertRedirect(route('novus.categories.index'))
        ->assertSessionHas('success', 'Category deleted successfully.');
    $this->assertEquals(Category::all()->count(), 1);
});

test('category validation rules are enforced', function () {
    $this->actingAsAuthor();

    // Test empty name
    $response = $this->post(route('novus.categories.store'), [
        'name' => '',
    ]);

    $response->assertStatus(302); // Redirects back with errors
    $response->assertInvalid(['name' => 'required']);

    // Test invalid parent_id
    $response = $this->post(route('novus.categories.store'), [
        'name' => 'Test Category',
        'parent_id' => 999,
    ]);

    $response->assertStatus(302);
    $response->assertInvalid(['parent_id']);
});

test('category slug is auto-generated if not provided', function () {
    $this->actingAsAuthor();

    $this->post(route('novus.categories.store'), [
        'name' => 'Test Category Name',
    ])->assertRedirect(route('novus.categories.index'));

    $this->assertDatabaseHas('novus_categories', [
        'name' => 'Test Category Name',
        'slug' => 'test-category-name',
    ]);
});
