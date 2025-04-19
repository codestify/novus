<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Shah\Novus\Http\Requests\CategoryRequest;
use Shah\Novus\Http\Resources\CategoryResource;
use Shah\Novus\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index()
    {
        $categories = Category::with('parent')
            ->withCount(['posts', 'children'])
            ->latest()
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create()
    {
        $parentCategories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Categories/Create', [
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(CategoryRequest $request)
    {
        $category = Category::create([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'description' => $request->description,
            'parent_id' => $request->parent_id,
        ]);

        // Handle SEO meta if provided
        if ($request->has('seo')) {
            $category->seoMeta()->create($request->seo);
        }

        return redirect()->route('novus.categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(Category $category)
    {
        CategoryResource::withoutWrapping();

        $category->load(['seoMeta', 'parent']);

        $parentCategories = DB::table('novus_categories')
            ->where('id', '!=', $category->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Categories/Edit', [
            'parent_categories' => $parentCategories,
            'category' => CategoryResource::make($category),
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        $category->update([
            'name' => $request->name,
            'slug' => $request->slug ?? Str::slug($request->name),
            'description' => $request->description,
            'parent_id' => $request->parent_id,
        ]);

        $category->load('seoMeta');

        // Update SEO meta if provided
        if ($request->has('seo')) {
            if ($category->seoMeta) {
                $category->seoMeta->update($request->seo);
            } else {
                $category->seoMeta()->create($request->seo);
            }
        }

        $category->refresh();

        return redirect()->route('novus.categories.edit', $category->id)
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category)
    {
        // Check if category has posts or children
        if ($category->posts()->count() > 0 || $category->children()->count() > 0) {
            return redirect()->route('novus.categories.index')
                ->with('error', 'Cannot delete category with associated posts or child categories.');
        }

        $category->delete();

        return redirect()->route('novus.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
