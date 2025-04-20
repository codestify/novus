<?php

use Illuminate\Contracts\Auth\Authenticatable;
use Shah\Novus\Contracts\Accessible;
use Shah\Novus\Services\Auth\AccessResolver;

it('implements the Accessible contract', function () {
    $resolver = new AccessResolver;
    expect($resolver)->toBeInstanceOf(Accessible::class);
});

it('denies access when user is null', function () {
    $resolver = new AccessResolver;
    expect($resolver->canAccess(null))->toBeFalse();
});

it('allows access when user is authenticated', function () {
    $resolver = new AccessResolver;

    // Create a mock Authenticatable object for testing
    $mockUser = $this->createMock(Authenticatable::class);

    expect($resolver->canAccess($mockUser))->toBeTrue();
});

it('works with any Authenticatable implementation', function () {
    $resolver = new AccessResolver;

    // Create a mock using PHP's anonymous class syntax
    $mockUser = new class implements Authenticatable
    {
        public function getAuthIdentifierName()
        {
            return 'id';
        }

        public function getAuthIdentifier()
        {
            return 1;
        }

        public function getAuthPassword()
        {
            return 'hashed-password';
        }

        public function getRememberToken()
        {
            return 'token';
        }

        public function setRememberToken($value) {}

        public function getRememberTokenName()
        {
            return 'remember_token';
        }

        // Required but not used in AccessResolver
        public function getAuthPasswordName()
        {
            return 'password';
        }
    };

    expect($resolver->canAccess($mockUser))->toBeTrue();
});
