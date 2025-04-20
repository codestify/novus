<?php

namespace Shah\Novus\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request)
    {

        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'parent_id' => $this->parent_id,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];

        if ($this->whenLoaded('parent') && $this->parent !== null) {
            $data['parent_category'] = [
                'id' => $this->parent->id,
                'name' => $this->parent->name,
            ];
        }

        if ($this->whenLoaded('seoMeta') && $this->seoMeta !== null) {
            $data['seo_meta'] = SeoMetaResource::make($this->seoMeta);
        }

        return $data;
    }
}
