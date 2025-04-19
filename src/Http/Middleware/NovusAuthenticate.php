<?php

namespace Shah\Novus\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Shah\Novus\Contracts\Accessible;
use Symfony\Component\HttpFoundation\Response;

class NovusAuthenticate
{
    public function __construct(
        protected Accessible $accessible
    ) {}

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::guard('novus')->check()) {
            return redirect()->route('novus.auth.login');
        }
        if (! $this->accessible->canAccess(Auth::guard('novus')->user())) {
            throw new AuthorizationException('You do not have access to this resource.');
        }

        return $next($request);
    }
}
