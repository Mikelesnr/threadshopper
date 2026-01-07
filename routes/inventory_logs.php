<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryLogController;

Route::get('/', [InventoryLogController::class, 'index'])->name('inventory-logs.index');
Route::get('/create', [InventoryLogController::class, 'create'])->name('inventory-logs.create');
Route::post('/', [InventoryLogController::class, 'store'])->name('inventory-logs.store');
Route::get('/{inventoryLog}', [InventoryLogController::class, 'show'])->name('inventory-logs.show');
Route::get('/{inventoryLog}/edit', [InventoryLogController::class, 'edit'])->name('inventory-logs.edit');
Route::put('/{inventoryLog}', [InventoryLogController::class, 'update'])->name('inventory-logs.update');
Route::delete('/{inventoryLog}', [InventoryLogController::class, 'destroy'])->name('inventory-logs.destroy');
