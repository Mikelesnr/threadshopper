<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/market', function () {
    return Inertia::render('Market/Index');
})->name('market');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile/info', [ProfileController::class, 'updateInfo'])->name('profile.update.info');
    Route::post('/profile/image', [ProfileController::class, 'updateImage'])->name('profile.update.image');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/checkout', function () {
        return Inertia::render('Market/CheckoutPage');
    })->name('checkout');
});

require __DIR__ . '/auth.php';

// Products
Route::prefix('products')->group(function () {
    require __DIR__ . '/products.php';
});

// Product Variants
Route::prefix('product-variants')->group(function () {
    require __DIR__ . '/product_variants.php';
});

// Categories
Route::prefix('categories')->group(function () {
    require __DIR__ . '/categories.php';
});

// Orders
Route::prefix('orders')->group(function () {
    require __DIR__ . '/orders.php';
});

// Order Items
Route::prefix('order-items')->group(function () {
    require __DIR__ . '/order_items.php';
});

// Payments
Route::prefix('payments')->group(function () {
    require __DIR__ . '/payments.php';
});

// Carts
Route::prefix('carts')->group(function () {
    require __DIR__ . '/carts.php';
});

// Inventory Logs
Route::prefix('inventory-logs')->group(function () {
    require __DIR__ . '/inventory_logs.php';
});
