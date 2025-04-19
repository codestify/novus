<?php

namespace Shah\Novus\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PostListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'status' => $this->status->label(),
            'featured' => $this->is_featured,
            'content' => $this->html_content,
            $this->mergeWhen($this->whenLoaded('author'), [
                'author' => [
                    'name' => $this->author->name,
                    'avatar' => $this->author->avatar,
                    'initials' => $this->author->initials,
                ],
            ]),
            'created_at' => $this->created_at->format('m/d/Y'),
            'categories' => $this->categories->pluck('name')->implode(', '),
            'published_at' => $this->published_at ? $this->published_at->format('jS M Y') : null,
        ];
    }
}
