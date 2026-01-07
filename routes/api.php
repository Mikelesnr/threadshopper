<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    EmailVerificationNotificationController,
    EmailVerificationPromptController,
    VerifyEmailController,
    PasswordResetLinkController,
    NewPasswordController,
    PasswordController,
    RegisteredUserController,
    AuthenticatedSessionController
};
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'apiStore']);
    Route::get('/email/verification-prompt', EmailVerificationPromptController::class . '@apiPrompt');
    Route::post('/email/verify', [VerifyEmailController::class, 'apiVerify']);

    Route::post('/password/update', [PasswordController::class, 'apiUpdate']);
});

Route::post('/password/forgot', [PasswordResetLinkController::class, 'apiStore']);
Route::post('/password/reset', [NewPasswordController::class, 'apiStore']);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,
        'name' => $request->user()->name,
        'email' => $request->user()->email,
        'phone' => $request->user()->phone,
        'address' => $request->user()->address,
        'city' => $request->user()->city,
        'country' => $request->user()->country,
        'profile_image' => $request->user()->profile_image,
        'role' => $request->user()->role,
        'status' => $request->user()->status,
    ]);
});

// Authentication Routes
Route::post('/register', [RegisteredUserController::class, 'apiStore']);

Route::post('/login', [AuthenticatedSessionController::class, 'apiLogin']);
Route::post('/logout', [AuthenticatedSessionController::class, 'apiLogout'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'apiStore']);
    Route::get('/email/verification-prompt', EmailVerificationPromptController::class, 'apiPrompt');
    Route::post('/email/verify', [VerifyEmailController::class, 'apiVerify']);

    Route::post('/password/update', [PasswordController::class, 'apiUpdate']);
});

Route::post('/password/forgot', [PasswordResetLinkController::class, 'apiStore']);
Route::post('/password/reset', [NewPasswordController::class, 'apiStore']);


// Public product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Public category routes 
Route::get('/categories', [CategoryController::class, 'index']);       // list all categories
Route::get('/categories/{category}', [CategoryController::class, 'show']); // single category details

//cart routes
Route::middleware('auth:sanctum')->group(function () {
    // Cart-level operations
    Route::get('/cart', [CartController::class, 'index']);       // view current user's cart
    Route::post('/cart', [CartController::class, 'store']);      // replace cart items
    Route::get('/cart/{cart}', [CartController::class, 'show']); // show cart by ID (rarely needed)
    Route::delete('/cart/{cart}', [CartController::class, 'destroy']); // delete cart

    // Item-level operations
    Route::post('/cart/items', [CartController::class, 'addItem']); // add single item
    Route::post('/cart/merge', [CartController::class, 'mergeGuestCart']); // merge guest cart into user cart
    Route::put('/cart/items/{variantId}', [CartController::class, 'updateItem']); // update item quantity
    Route::delete('/cart/items/{variantId}', [CartController::class, 'removeItem']); // remove item
});

//order routes
Route::middleware('auth:sanctum')->group(function () {
    // List all orders for the authenticated user
    Route::get('/orders', [OrderController::class, 'myOrders']);

    // Create a new order (COD or Paynow)
    Route::post('/orders', [OrderController::class, 'store']);

    // Show a single order with items
    Route::get('/orders/{order}', [OrderController::class, 'show']);
});
