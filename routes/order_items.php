<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderItemController;

Route::post('/', [OrderItemController::class, 'store'])->name('order-items.store');
Route::delete('/{orderItem}', [OrderItemController::class, 'destroy'])->name('order-items.destroy');
