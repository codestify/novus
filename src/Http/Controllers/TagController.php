<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Shah\Novus\Models\Tag;

class TagController extends Controller
{
    /**
     * Display tags management page with pagination.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $query = Tag::withCount('posts');

        // Apply search if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Apply sorting (default to name ascending)
        $sortField = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');

        if ($sortField === 'usage') {
            $query->orderBy('posts_count', $sortDirection);
        } elseif ($sortField === 'created_at') {
            $query->orderBy('created_at', $sortDirection);
        } else {
            $query->orderBy('name', $sortDirection);
        }

        // Get paginated results
        $tags = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Tags/Management', [
            'tags' => $tags,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created tag in storage.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:100', 'unique:novus_tags,slug'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Tag::create($validated);

        return redirect()->route('novus.tags.index')
            ->with('success', 'Tag created successfully.');
    }

    /**
     * Update the specified tag in storage.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:100', 'unique:novus_tags,slug,'.$tag->id],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $tag->update($validated);

        return redirect()->route('novus.tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified tag from storage.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Tag $tag)
    {
        // Detach the tag from all posts
        $tag->posts()->detach();

        // Delete the tag
        $tag->delete();

        return redirect()->route('novus.tags.index')
            ->with('success', 'Tag deleted successfully.');
    }

    /**
     * Bulk delete multiple tags.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'tag_ids' => ['required', 'array'],
            'tag_ids.*' => ['exists:novus_tags,id'],
        ]);

        $tags = Tag::whereIn('id', $validated['tag_ids'])->get();

        foreach ($tags as $tag) {
            $tag->posts()->detach();
            $tag->delete();
        }

        return redirect()->route('novus.tags.index')
            ->with('success', count($validated['tag_ids']).' tags deleted successfully.');
    }

    /**
     * Export tags as CSV.
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export()
    {
        $tags = Tag::withCount('posts')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="tags-export.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($tags) {
            $file = fopen('php://output', 'w');

            // Add headers
            fputcsv($file, ['ID', 'Name', 'Slug', 'Posts Count', 'Created At']);

            // Add data rows
            foreach ($tags as $tag) {
                fputcsv($file, [
                    $tag->id,
                    $tag->name,
                    $tag->slug,
                    $tag->posts_count,
                    $tag->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Import tags from CSV.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function import(Request $request)
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $file = $request->file('csv_file');
        $path = $file->getRealPath();

        $imported = 0;
        $skipped = 0;

        if (($handle = fopen($path, 'r')) !== false) {
            // Skip header row
            fgetcsv($handle);

            while (($data = fgetcsv($handle)) !== false) {
                // Expect: name, slug (optional)
                if (isset($data[0]) && ! empty($data[0])) {
                    $name = trim($data[0]);
                    $slug = isset($data[1]) && ! empty($data[1]) ? trim($data[1]) : Str::slug($name);

                    // Check if tag with this slug already exists
                    if (Tag::where('slug', $slug)->exists()) {
                        $skipped++;

                        continue;
                    }

                    Tag::create([
                        'name' => $name,
                        'slug' => $slug,
                    ]);

                    $imported++;
                }
            }

            fclose($handle);
        }

        return redirect()->route('novus.tags.index')
            ->with('success', "Tags imported successfully: {$imported} imported, {$skipped} skipped (duplicates).");
    }
}
