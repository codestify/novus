<?php

namespace Shah\Novus\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SeoMetaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'canonical_url' => $this->canonical_url,
            'meta_keywords' => $this->meta_keywords,
            'og_title' => $this->og_title,
            'og_description' => $this->og_description,
            'og_image' => $this->og_image,
            'og_type' => $this->og_type,
            'twitter_title' => $this->twitter_title,
            'twitter_description' => $this->twitter_description,
            'twitter_image' => $this->twitter_image,
            'twitter_card' => $this->twitter_card,
            'robots_noindex' => $this->robots_noindex,
            'robots_nofollow' => $this->robots_nofollow,
        ];
    }
}
