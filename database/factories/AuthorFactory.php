<?php

namespace Shah\Novus\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Shah\Novus\Models\Author;

class AuthorFactory extends Factory
{
    protected $model = Author::class;

    public function definition(): array
    {
        return [
            'ulid' => (string) Str::ulid(),
            'name' => $this->faker->name(),
            'slug' => $this->faker->unique()->slug(),
            'bio' => $this->faker->paragraph(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'website' => $this->faker->url(),
            'avatar' => $this->faker->imageUrl(),
            'social_links' => [
                'twitter' => $this->faker->url(),
                'facebook' => $this->faker->url(),
                'instagram' => $this->faker->url(),
            ],
            'remember_token' => Str::random(10),
            'email_verified_at' => now(),
        ];
    }

    public function unverified(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
