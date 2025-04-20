<?php

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Shah\Novus\Http\Controllers\AIController;
use Shah\Novus\Http\Controllers\Auth\AuthenticateController;
use Shah\Novus\Http\Controllers\BulkActionPostController;
use Shah\Novus\Http\Controllers\BulkActionSubscriberController;
use Shah\Novus\Http\Controllers\CategoryController;
use Shah\Novus\Http\Controllers\DashboardController;
use Shah\Novus\Http\Controllers\MediaController;
use Shah\Novus\Http\Controllers\MediaGalleryController;
use Shah\Novus\Http\Controllers\MediaUploadController;
use Shah\Novus\Http\Controllers\PerformanceController;
use Shah\Novus\Http\Controllers\PostController;
use Shah\Novus\Http\Controllers\SeoController;
use Shah\Novus\Http\Controllers\StatisticsController;
use Shah\Novus\Http\Controllers\SubscriberController;

Route::middleware('novus.guest')->group(function () {
    Route::get('/login', [AuthenticateController::class, 'showLoginForm'])->name('auth.login');
    Route::post('/login', [AuthenticateController::class, 'login'])->name('auth.attempt');
});

Route::middleware('novus.auth')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::patch('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::get('/posts/{post}/preview', [PostController::class, 'preview'])->name('posts.preview');

    Route::post('/posts/bulk/action', BulkActionPostController::class)->name('posts.bulk.action');

    Route::resource('/categories', CategoryController::class);

    Route::get('/media', [MediaController::class, 'index'])->name('media.index');

    Route::get('/media/{id}', [MediaController::class, 'show'])->name('media.show');
    Route::patch('/media/{id}', [MediaController::class, 'update'])->name('media.update');
    Route::delete('/media/{id}', [MediaController::class, 'destroy'])->name('media.destroy');
    Route::post('/media/bulk-destroy', [MediaController::class, 'bulkDestroy'])->name('media.bulk-destroy');

    Route::get('/subscribers', [SubscriberController::class, 'index'])->name('subscribers.index');
    Route::post('/subscribers', [SubscriberController::class, 'store'])->name('subscribers.store');
    Route::patch('/subscribers/{subscriber}', [SubscriberController::class, 'update'])->name('subscribers.update');
    Route::delete('/subscribers/{subscriber}', [SubscriberController::class, 'destroy'])->name('subscribers.destroy');
    Route::delete('/subscribers', [SubscriberController::class, 'bulkDestroy'])->name('subscribers.bulk-destroy');
    Route::post('/subscribers/bulk/action', BulkActionSubscriberController::class)->name('subscribers.bulk.action');

    Route::get('/gallery/items', MediaGalleryController::class)->name('media.selector');

    Route::get('/statistics', StatisticsController::class)->name('analytics');
    Route::get('/performance', PerformanceController::class)->name('performance');

    // AI content enhancement route
    Route::post('/ai/action', [AIController::class, 'handleAction'])->name('ai.action');
    Route::post('/ai/generate-seo', [SeoController::class, 'generateSeo'])
        ->name('ai.generate-seo');

    Route::post('/media/upload', MediaUploadController::class)
        ->name('media.upload')
        ->withoutMiddleware([VerifyCsrfToken::class]);

    Route::post('/logout', [AuthenticateController::class, 'logout'])->name('auth.logout');
});
