<?php

namespace Shah\Novus\Enums;

enum PostStatus: int
{
    case Draft = 1;
    case Published = 2;
    case Archived = 3;
    case Scheduled = 4;

    /**
     * Get the string representation of the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'draft',
            self::Published => 'published',
            self::Archived => 'archived',
            self::Scheduled => 'scheduled',
        };
    }

    /**
     * Get all available statuses as an array with ID => label format.
     */
    public static function getOptions(): array
    {
        return [
            self::Draft->value => self::Draft->label(),
            self::Published->value => self::Published->label(),
            self::Archived->value => self::Archived->label(),
            self::Scheduled->value => self::Scheduled->label(),
        ];
    }

    /**
     * Get status by name.
     */
    public static function fromName(string $name): ?self
    {
        return match (strtolower($name)) {
            'draft' => self::Draft,
            'published' => self::Published,
            'archived' => self::Archived,
            'scheduled' => self::Scheduled,
            default => null,
        };
    }
}
