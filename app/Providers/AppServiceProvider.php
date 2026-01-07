<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Enums\Role;
use Illuminate\Support\Facades\Gate;
use App\Services\CartService;
use App\Services\PaynowService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind CartService as a singleton
        $this->app->singleton(CartService::class, function ($app) {
            return new CartService();
        });

        $this->app->singleton(PaynowService::class, function ($app) {
            return new PaynowService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::define('is-admin', function ($user) {
            return $user->role === Role::Admin->value;
        });

        Gate::define('is-customer', function ($user) {
            return $user->role === Role::Customer->value;
        });

        Gate::define('is-staff', function ($user) {
            return in_array($user->role, [Role::Admin->value, Role::Staff->value]);
        });

        Gate::define('view-cart', function ($user) {
            return $user->role === Role::Customer->value;
        });
    }
}
