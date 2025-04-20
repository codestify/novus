<?php

namespace Shah\Novus\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->ulid,
            'name' => $this->name,
            'slug' => $this->slug,
            'bio' => $this->bio,
            'email' => $this->email,
            'website' => $this->website,
            'avatar' => $this->avatar,
            'social_links' => $this->social_links,
            'created_at' => $this->created_at->format('d-m-Y'),
            'updated_at' => $this->updated_at->format('d-m-Y'),
        ];
    }
}
