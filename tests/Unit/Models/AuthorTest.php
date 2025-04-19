<?php

use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Shah\Novus\Models\Author;
use Shah\Novus\Models\Post;

it('extends the Authenticatable class', function () {
    $parentClass = get_parent_class(Author::class);
    expect($parentClass)->toBe('Illuminate\Foundation\Auth\User');
});

it('uses the correct table name', function () {
    $author = new Author;
    expect($author->getTable())->toBe('novus_authors');
});

it('uses soft deletes', function () {
    $author = new Author;
    expect(in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses_recursive($author)))->toBeTrue();
});

it('hides sensitive attributes', function () {
    $author = new Author;
    $hidden = $author->getHidden();

    expect($hidden)->toContain('password')
        ->and($hidden)->toContain('remember_token');
});

it('casts date fields correctly', function () {
    $author = new Author;
    $casts = $author->getCasts();

    expect($casts)->toHaveKey('email_verified_at')
        ->and($casts['email_verified_at'])->toBe('datetime');
});

it('casts social_links as a collection', function () {
    $author = new Author;
    $casts = $author->getCasts();

    expect($casts)->toHaveKey('social_links')
        ->and($casts['social_links'])->toBe(AsCollection::class);
});

it('has a posts relationship', function () {
    $author = new Author;
    expect($author->posts())->toBeInstanceOf(HasMany::class)
        ->and($author->posts()->getRelated())->toBeInstanceOf(Post::class);
});

it('generates avatar from email by default', function () {
    $author = Author::factory()->create([
        'email' => 'test@example.com',
        'avatar' => null,
    ]);

    expect($author->avatar)->toContain('gravatar.com/avatar/')
        ->and($author->avatar)->toContain(md5('test@example.com'));
});

it('returns custom avatar when set', function () {
    $customAvatar = 'https://example.com/avatar.jpg';
    $author = Author::factory()->create([
        'avatar' => $customAvatar,
    ]);

    expect($author->avatar)->toBe($customAvatar);
});

it('generates initials from name', function () {
    $author = Author::factory()->create([
        'name' => 'John Doe',
    ]);

    expect($author->initials)->toBe('JD');

    $author = Author::factory()->create([
        'name' => 'John Middle Doe',
    ]);

    expect($author->initials)->toBe('JMD');
});

it('can create posts associated with an author', function () {
    $author = Author::factory()->create();

    Post::factory()->count(3)->create([
        'author_id' => $author->id,
    ]);

    expect($author->posts)->toHaveCount(3);
});

it('can store and retrieve social links', function () {
    $author = Author::factory()->create();

    $socialLinks = [
        'twitter' => 'https://twitter.com/johnsmith',
        'github' => 'https://github.com/johnsmith',
        'linkedin' => 'https://linkedin.com/in/johnsmith',
    ];

    $author->social_links = $socialLinks;
    $author->save();

    $author->refresh();

    expect($author->social_links)->toBeInstanceOf(Collection::class)
        ->and($author->social_links->toArray())->toEqual($socialLinks);
});
