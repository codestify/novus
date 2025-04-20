<?php

namespace Shah\Novus\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Shah\Novus\Models\Post;
use Shah\Novus\Models\SeoMeta;

class SeoMetaFactory extends Factory
{
    protected $model = SeoMeta::class;

    public function definition(): array
    {
        return [
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->paragraph(),
            'canonical_url' => $this->faker->url(),
            'meta_keywords' => implode(', ', $this->faker->words(5)),
            'og_title' => $this->faker->sentence(),
            'og_description' => $this->faker->paragraph(),
            'og_image' => $this->faker->imageUrl(),
            'og_type' => 'article',
            'twitter_title' => $this->faker->sentence(),
            'twitter_description' => $this->faker->paragraph(),
            'twitter_image' => $this->faker->imageUrl(),
            'twitter_card' => 'summary_large_image',
            'robots_noindex' => false,
            'robots_nofollow' => false,
            'structured_data' => [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $this->faker->sentence(),
                'description' => $this->faker->paragraph(),
            ],
            'metable_id' => Post::factory(),
            'metable_type' => Post::class,
        ];
    }

    public function noindex(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'robots_noindex' => true,
            ];
        });
    }

    public function nofollow(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'robots_nofollow' => true,
            ];
        });
    }
}
