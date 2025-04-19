<?php

namespace Shah\Novus\Models;

use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscriber extends Model
{
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'novus_subscribers';

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'preferences' => AsCollection::class,
            'subscribed_at' => 'datetime',
            'email_verified_at' => 'datetime',
        ];
    }

    /**
     * Check if the subscriber is verified
     */
    public function isVerified(): bool
    {
        return $this->email_verified_at !== null;
    }
}
