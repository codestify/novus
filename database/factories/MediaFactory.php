<?php

namespace Shah\Novus\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Shah\Novus\Models\Media;

class MediaFactory extends Factory
{
    protected $model = Media::class;

    public function definition(): array
    {
        $name = $this->faker->word();
        $mimeType = $this->faker->randomElement(['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'audio/mpeg']);
        $extension = $this->getExtensionFromMimeType($mimeType);
        $fileName = $this->faker->uuid().'.'.$extension;

        return [
            'name' => $name,
            'path' => 'media/'.$fileName,
            'mime_type' => $mimeType,
            'type' => $this->getMediaType($mimeType),
            'disk' => 'public',
            'collection_name' => $this->faker->optional()->word(),
            'size' => $this->faker->numberBetween(1000, 1000000),
            'custom_properties' => [
                'width' => $this->faker->numberBetween(100, 2000),
                'height' => $this->faker->numberBetween(100, 2000),
            ],
            'alt_text' => $this->faker->sentence(),
            'title' => $this->faker->sentence(),
        ];
    }

    public function image(): self
    {
        return $this->state(function (array $attributes) {
            $mimeType = $this->faker->randomElement(['image/jpeg', 'image/png', 'image/gif']);
            $extension = $this->getExtensionFromMimeType($mimeType);
            $fileName = $this->faker->uuid().'.'.$extension;

            return [
                'mime_type' => $mimeType,
                'type' => 0,
                'path' => 'media/'.$fileName,
            ];
        });
    }

    public function video(): self
    {
        return $this->state(function (array $attributes) {
            $fileName = $this->faker->uuid().'.mp4';

            return [
                'mime_type' => 'video/mp4',
                'type' => 1,
                'path' => 'media/'.$fileName,
            ];
        });
    }

    public function audio(): self
    {
        return $this->state(function (array $attributes) {
            $fileName = $this->faker->uuid().'.mp3';

            return [
                'mime_type' => 'audio/mpeg',
                'type' => 2,
                'path' => 'media/'.$fileName,
            ];
        });
    }

    private function getMediaType(string $mimeType): int
    {
        return match (true) {
            str_starts_with($mimeType, 'image/') => 0,
            str_starts_with($mimeType, 'video/') => 1,
            str_starts_with($mimeType, 'audio/') => 2,
            default => 0,
        };
    }

    private function getExtensionFromMimeType(string $mimeType): string
    {
        return match ($mimeType) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'video/mp4' => 'mp4',
            'audio/mpeg' => 'mp3',
            default => 'jpg',
        };
    }
}
