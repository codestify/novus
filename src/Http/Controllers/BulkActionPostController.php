<?php

namespace Shah\Novus\Http\Controllers;

use Closure;
use Illuminate\Http\Request;
use Shah\Novus\Enums\PostStatus;
use Shah\Novus\Models\Post;

class BulkActionPostController
{
    public function __invoke(Request $request)
    {
        $action = $request->input('action');
        $post_ids = $request->input('post_ids');

        if (empty($post_ids)) {
            return redirect()->route('posts.index')
                ->with('error', 'No posts selected.');
        }

        $posts = Post::whereIn('id', $post_ids)->get();

        $result = $this->getRelevantAction($action);

        if (! $result) {
            return redirect()->route('posts.index')
                ->with('error', 'Invalid action.');
        }

        $actionData = $result();
        $posts->each($actionData['callback']);

        return redirect()->back()
            ->with('success', $actionData['message']);
    }

    public function getRelevantAction(mixed $action): ?Closure
    {
        $result = match ($action) {
            'delete' => fn () => [
                'message' => 'Posts deleted successfully.',
                'callback' => fn ($post) => $post->delete(),
            ],
            'publish' => fn () => [
                'message' => 'Posts published successfully.',
                'callback' => fn ($post) => $post->update(['status' => PostStatus::Published]),
            ],
            'draft' => fn () => [
                'message' => 'Posts unpublished successfully.',
                'callback' => fn ($post) => $post->update(['status' => PostStatus::Draft]),
            ],
            'feature' => fn () => [
                'message' => 'Posts featured successfully.',
                'callback' => fn ($post) => $post->update(['is_featured' => true]),
            ],
            'unfeature' => fn () => [
                'message' => 'Posts unfeatured successfully.',
                'callback' => fn ($post) => $post->update(['is_featured' => false]),
            ],
            default => null,
        };

        return $result;
    }
}
