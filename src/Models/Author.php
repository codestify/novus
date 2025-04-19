<?php

namespace Shah\Novus\Models;

use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Author extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $table = 'novus_authors';

    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'social_links' => AsCollection::class,
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Author $model) {
            $model->ulid = Str::ulid(now());
        });
    }

    /**
     * Get all of the posts for the author.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the author's avatar.
     */
    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => $value ?: 'https://secure.gravatar.com/avatar/' . md5(strtolower(trim($this->email))) . '?s=80'
        );
    }

    protected function initials(): Attribute
    {
        return Attribute::make(
            get: fn() => collect(explode(' ', $this->name))->map(fn($name) => Str::upper(Str::substr($name, 0, 1)))->implode('')
        );
    }
}
