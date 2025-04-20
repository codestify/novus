<?php

namespace Shah\Novus\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'novus_media';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'type' => 'integer',
        'size' => 'integer',
        'custom_properties' => AsArrayObject::class,
    ];

    /**
     * The media types.
     *
     * @var array<int, string>
     */
    public const TYPES = [
        0 => 'image',
        1 => 'video',
        2 => 'audio',
        3 => 'document',
    ];

    /**
     * Get all posts that use this media.
     */
    public function posts(): MorphToMany
    {
        return $this->morphedByMany(Post::class, 'mediable', 'novus_mediables')
            ->withPivot('collection_name', 'order_column');
    }

    /**
     * Get the media type name.
     */
    protected function typeName(): Attribute
    {
        return Attribute::make(
            get: fn () => self::TYPES[$this->getAttribute('type')] ?? 'unknown',
        );
    }

    /**
     * Get the URL for the media file.
     */
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getUrlForPath($this->getAttribute('path'), $this->getAttribute('disk')),
        );
    }

    /**
     * Generate URL for a path on a given disk.
     */
    private function getUrlForPath(string $path, string $disk): string
    {
        // Use a simpler approach that works consistently
        return asset('storage/'.$path);
    }
}
