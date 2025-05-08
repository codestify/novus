<?php

namespace Shah\Novus\Events;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Shah\Novus\Models\Post;

class NewPostWasCreated
{
    use dispatchable;

    public function __construct(
        public Post|Model $post,
    ) {}
}
