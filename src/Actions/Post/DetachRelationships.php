<?php

namespace Shah\Novus\Actions\Post;

use Shah\Novus\Models\Post;

class DetachRelationships
{
    public function handle(Post $post, \Closure $next)
    {
        // Detach all relationships
        $post->categories()->detach();
        $post->tags()->detach();
        $post->media()->detach();

        return $next($post);
    }
}
