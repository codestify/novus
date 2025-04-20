<?php

namespace Shah\Novus\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Shah\Novus\Models\Author;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

class CreateAuthorCommand extends Command
{
    protected $signature = 'novus:create-author';

    protected $description = 'Create a new author for Novus';

    public function handle()
    {
        $this->info('Creating a new author...');

        $name = text(
            label: 'What is the author\'s name?',
            required: true,
            validate: fn ($value) => strlen($value) >= 3 ? null : 'Name must be at least 3 characters.'
        );

        $email = text(
            label: 'What is the author\'s email?',
            required: true,
            validate: fn ($value) => filter_var($value, FILTER_VALIDATE_EMAIL) ? null : 'Please enter a valid email address.'
        );

        $password = password(
            label: 'What is the author\'s password?',
            required: true,
            validate: fn ($value) => strlen($value) >= 8 ? null : 'Password must be at least 8 characters.'
        );

        password(
            label: 'Please confirm the password',
            required: true,
            validate: fn ($value) => $value === $password ? null : 'Passwords do not match.'
        );

        try {
            $author = Author::create([
                'name' => $name,
                'email' => $email,
                'slug' => Str::slug($name),
                'password' => Hash::make($password),
            ]);

            $this->components->info('Author created successfully!');
            $this->newLine();

            $this->newLine();

            $this->table(
                ['Name', 'Email', 'Password'],
                [
                    [$name, $email, $password],
                ]
            );

            $this->newLine();
        } catch (\Exception $e) {
            $this->error('Failed to create author: '.$e->getMessage());
        }
    }
}
