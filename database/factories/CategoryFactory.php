<?php

namespace Shah\Novus\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Shah\Novus\Models\Category;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->word();

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'parent_id' => null,
        ];
    }

    public function withParent(Category $parent): self
    {
        return $this->state(function (array $attributes) use ($parent) {
            return [
                'parent_id' => $parent->id,
            ];
        });
    }
}
