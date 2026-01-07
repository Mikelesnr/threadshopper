<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;

class CartService
{
    public function getUserCart(): Cart
    {
        return Cart::firstOrCreate(['user_id' => Auth::id()]);
    }

    public function addItem(array $item): Cart
    {
        $cart = $this->getUserCart();
        $items = $cart->items ?? [];

        // Check if variant already exists in cart
        $existingIndex = collect($items)->search(fn($i) => $i['variant_id'] == $item['variant_id']);

        // Validate stock from DB
        $variant = ProductVariant::findOrFail($item['variant_id']);
        $availableStock = $variant->stock;

        if ($existingIndex !== false) {
            // Already in cart → increment quantity
            $currentQty = $items[$existingIndex]['quantity'];
            $newQty = $currentQty + $item['quantity'];

            // Cap at available stock
            if ($newQty > $availableStock) {
                $newQty = $availableStock;
            }

            $items[$existingIndex]['quantity'] = $newQty;
        } else {
            // New item → cap at available stock
            if ($item['quantity'] > $availableStock) {
                $item['quantity'] = $availableStock;
            }
            $items[] = $item;
        }

        $cart->items = $items;
        $cart->save();

        return $cart;
    }

    public function updateItemQuantity(int $variantId, int $quantity): Cart
    {
        $cart = $this->getUserCart();
        $items = $cart->items ?? [];

        $variant = ProductVariant::findOrFail($variantId);
        $availableStock = $variant->stock;

        $items = collect($items)->map(function ($item) use ($variantId, $quantity, $availableStock) {
            if ($item['variant_id'] == $variantId) {
                // Cap at available stock
                $item['quantity'] = min($quantity, $availableStock);
            }
            return $item;
        })->toArray();

        $cart->items = $items;
        $cart->save();

        return $cart;
    }

    public function removeItem(int $variantId): Cart
    {
        $cart = $this->getUserCart();
        $items = collect($cart->items)->reject(fn($item) => $item['variant_id'] == $variantId)->values()->toArray();

        $cart->items = $items;
        $cart->save();

        return $cart;
    }

    public function calculateTotal(): float
    {
        $cart = $this->getUserCart();
        return collect($cart->items)->sum(fn($item) => $item['price'] * $item['quantity']);
    }
}
