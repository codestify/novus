<?php

namespace Shah\Novus\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfNovusAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @return mixed
     */
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::guard('novus')->check()) {
            return redirect('/'.config('novus.path', 'novus'));
        }

        return $next($request);
    }
}
