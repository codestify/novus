<?php

namespace Shah\Novus\Database\Factories;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Shah\Novus\Models\Author;
use Shah\Novus\Models\Post;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $title = $this->faker->sentence();

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => $this->faker->paragraph(),
            'content' => $this->faker->paragraphs(3, true),
            'content_html' => $this->faker->paragraphs(3, true),
            'published_at' => null,
            'is_featured' => false,
            'status' => 1,
            'author_id' => Author::factory(),
            'post_type' => 'post',
            'template' => null,
        ];
    }

    public function published(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'is_draft' => false,
                'published_at' => now(),
            ];
        });
    }

    public function featured(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'is_featured' => true,
            ];
        });
    }

    public function withAuthor(Authenticatable $author): self
    {
        return $this->state(function (array $attributes) use ($author) {
            return [
                'author_id' => $author->id,
            ];
        });
    }
}
