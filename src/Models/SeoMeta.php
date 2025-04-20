<?php

namespace Shah\Novus\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SeoMeta extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'novus_seo_meta';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'robots_noindex' => 'boolean',
            'robots_nofollow' => 'boolean',
            'structured_data' => AsArrayObject::class,
        ];
    }

    /**
     * Get the parent metable model.
     */
    public function metable(): MorphTo
    {
        return $this->morphTo();
    }
}
