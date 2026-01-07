<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

Route::get('/', [PaymentController::class, 'index'])->name('payments.index');
Route::get('/create', [PaymentController::class, 'create'])->name('payments.create');
Route::post('/', [PaymentController::class, 'store'])->name('payments.store');
Route::get('/{payment}', [PaymentController::class, 'show'])->name('payments.show');
Route::get('/{payment}/edit', [PaymentController::class, 'edit'])->name('payments.edit');
Route::put('/{payment}', [PaymentController::class, 'update'])->name('payments.update');
Route::delete('/{payment}', [PaymentController::class, 'destroy'])->name('payments.destroy');
