<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;

Route::get('', [CartController::class, 'index'])->name('carts.index');
Route::post('', [CartController::class, 'store'])->name('carts.store');
Route::get('/{cart}', [CartController::class, 'show'])->name('carts.show');
Route::put('/{cart}', [CartController::class, 'update'])->name('carts.update');
Route::delete('/{cart}', [CartController::class, 'destroy'])->name('carts.destroy');

// Item-level routes
Route::post('/items', [CartController::class, 'addItem'])->name('carts.items.add');
Route::put('/items/{variantId}', [CartController::class, 'updateItem'])->name('carts.items.update');
Route::delete('/items/{variantId}', [CartController::class, 'removeItem'])->name('carts.items.remove');
Route::post('/merge', [CartController::class, 'mergeGuestCart'])->name('carts.merge');
