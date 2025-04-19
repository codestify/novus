<?php

namespace Shah\Novus\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'novus_categories';

    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the child categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Get all posts that belong to this category.
     */
    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'categorizable', 'novus_categorizables');
    }

    /**
     * Get the category's SEO meta data.
     */
    public function seoMeta(): MorphOne
    {
        return $this->morphOne(SeoMeta::class, 'metable');
    }

    /**
     * Get the media attached to the category.
     */
    public function media(): MorphToMany
    {
        return $this->morphToMany(Media::class, 'mediable', 'novus_mediables')
            ->withPivot('collection_name', 'order_column');
    }
}
