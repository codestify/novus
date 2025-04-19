<?php

use Shah\Novus\Models\Author;

beforeEach(function () {
    $this->withoutVite();
});

test('guest middleware redirects authenticated users', function () {
    // Create an author
    $author = Author::factory()->create([
        'password' => bcrypt('password'),
    ]);

    // Log in using the novus guard
    $this->actingAs($author, 'novus')
        ->get(route('novus.auth.login'))
        ->assertRedirect(route('novus.dashboard'));
});

test('auth middleware redirects guests', function () {
    $this->get(route('novus.dashboard'))
        ->assertRedirect(route('novus.auth.login'));
});

test('login page is accessible to guests', function () {
    $this->get(route('novus.auth.login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Auth/Login'));
});

test('user can login with valid credentials', function () {
    // Create an author with a known password
    $author = Author::factory()->create([
        'password' => bcrypt('password'),
    ]);

    $this->post(route('novus.auth.attempt'), [
        'email' => $author->email,
        'password' => 'password',
    ])->assertRedirect(route('novus.dashboard'));

    // Check authentication with the novus guard
    $this->assertAuthenticatedAs($author, 'novus');
});

test('user cannot login with invalid credentials', function () {
    $author = Author::factory()->create([
        'password' => bcrypt('correct-password'),
    ]);

    $this->post(route('novus.auth.attempt'), [
        'email' => $author->email,
        'password' => 'wrong-password',
    ])->assertRedirect()
        ->assertSessionHasErrors('email');

    $this->assertGuest('novus');
});

test('authenticated user can logout', function () {
    // Create an author and log them in
    $author = Author::factory()->create();

    $this->actingAs($author, 'novus')
        ->post(route('novus.auth.logout'))
        ->assertRedirect(route('novus.auth.login'));

    // Check that user is logged out from the novus guard
    $this->assertGuest('novus');
});
