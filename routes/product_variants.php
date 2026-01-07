<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductVariantController;

Route::get('/', [ProductVariantController::class, 'index'])->name('product_variants.index');
Route::get('/create', [ProductVariantController::class, 'create'])->name('product_variants.create');
Route::post('/', [ProductVariantController::class, 'store'])->name('product_variants.store');
Route::get('/{variant}', [ProductVariantController::class, 'show'])->name('product_variants.show');
Route::get('/{variant}/edit', [ProductVariantController::class, 'edit'])->name('product_variants.edit');
Route::put('/{variant}', [ProductVariantController::class, 'update'])->name('product_variants.update');
Route::delete('/{variant}', [ProductVariantController::class, 'destroy'])->name('product_variants.destroy');
