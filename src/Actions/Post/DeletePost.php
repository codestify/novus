<?php

namespace Shah\Novus\Actions\Post;

use Shah\Novus\Models\Post;

class DeletePost
{
    public function handle(Post $post, \Closure $next)
    {
        // Delete the post itself
        $post->delete();

        return $next($post);
    }
}
