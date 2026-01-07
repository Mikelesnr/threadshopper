<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

Route::get('/', [OrderController::class, 'index'])->name('orders.index');
Route::get('/create', [OrderController::class, 'create'])->name('orders.create');
Route::post('/', [OrderController::class, 'store'])->name('orders.store');
Route::get('/{order}', [OrderController::class, 'show'])->name('orders.show');
Route::get('/{order}/edit', [OrderController::class, 'edit'])->name('orders.edit');
Route::put('/{order}', [OrderController::class, 'update'])->name('orders.update');
Route::delete('/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
