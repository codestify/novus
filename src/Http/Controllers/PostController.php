<?php

namespace Shah\Novus\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Pipeline;
use Inertia\Inertia;
use Shah\Novus\Actions\Post\CleanupOrphanedMedia;
use Shah\Novus\Actions\Post\DeletePost;
use Shah\Novus\Actions\Post\DeleteSeoMeta;
use Shah\Novus\Actions\Post\DetachRelationships;
use Shah\Novus\Enums\PostStatus;
use Shah\Novus\Http\Requests\PostRequest;
use Shah\Novus\Http\Resources\CategoryResource;
use Shah\Novus\Http\Resources\PostListResource;
use Shah\Novus\Http\Resources\PostResource;
use Shah\Novus\Http\Resources\TagResource;
use Shah\Novus\Models\Category;
use Shah\Novus\Models\Post;
use Shah\Novus\Models\Tag;
use Shah\Novus\Services\PostService;

class PostController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status', 'all');

        $query = Post::with('author')->newQuery();

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status !== 'all') {
            $query->where('status', PostStatus::fromName($status));
        }

        $posts = $query->paginate(
            perPage: 5,
            columns: [
                'id',
                'author_id',
                'title',
                'slug',
                'excerpt',
                'content_html',
                'status',
                'is_featured',
                'created_at',
                'published_at',
            ]
        )->withQueryString();

        return Inertia::render('Posts/Index', [
            'posts' => PostListResource::collection($posts),
        ]);
    }

    public function create()
    {
        CategoryResource::withoutWrapping();
        TagResource::withoutWrapping();

        $allCategories = Category::all();
        $allTags = Tag::all();

        return Inertia::render('Posts/Create', [
            'all_categories' => CategoryResource::collection($allCategories),
            'all_tags' => TagResource::collection($allTags),
        ]);
    }

    public function edit(Post $post)
    {
        PostResource::withoutWrapping();
        CategoryResource::withoutWrapping();
        TagResource::withoutWrapping();

        $post->load(['categories', 'tags', 'author', 'seoMeta', 'media']);
        $allCategories = Category::all();
        $allTags = Tag::all();

        return Inertia::render('Posts/Edit', [
            'blog_post' => PostResource::make($post),
            'all_categories' => CategoryResource::collection($allCategories),
            'all_tags' => TagResource::collection($allTags),
        ]);
    }

    public function update(PostRequest $request, Post $post)
    {
        try {
            $post = $this->postService->updatePost($post, $request->validated());

            return redirect()
                ->route('novus.posts.edit', $post)
                ->with('success', 'Post updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update post: '.$e->getMessage());
        }
    }

    public function store(PostRequest $request)
    {
        $post = $this->postService->createPost($request->validated());

        return redirect()
            ->route('novus.posts.edit', $post)
            ->with('success', 'Post created successfully');

    }

    public function destroy(Post $post)
    {
        try {
            $post->load(['media', 'categories', 'tags']);

            DB::beginTransaction();

            Pipeline::send($post)
                ->through([
                    DetachRelationships::class,
                    DeleteSeoMeta::class,
                    DeletePost::class,
                    CleanupOrphanedMedia::class,
                ])
                ->thenReturn();

            DB::commit();

            return redirect()
                ->route('novus.posts.index')
                ->with('success', 'Post deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to delete post: '.$e->getMessage());
        }
    }
}
