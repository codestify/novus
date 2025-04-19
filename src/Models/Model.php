<?php

namespace Shah\Novus\Models;

use Illuminate\Database\Eloquent\Model as LaravelModel;

abstract class Model extends LaravelModel
{
    protected $guarded = [];

    /**
     * Get the current connection name for the model.
     */
    public function getConnectionName(): string
    {
        return config('novus.database_connection');
    }
}
