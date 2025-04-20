<?php

namespace Shah\Novus\Actions\Post;

use Shah\Novus\Models\Post;

class DeleteSeoMeta
{
    public function handle(Post $post, \Closure $next)
    {
        if ($post->seoMeta) {
            $post->seoMeta->delete();
        }

        return $next($post);
    }
}
