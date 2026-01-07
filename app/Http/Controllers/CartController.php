<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\CartService;
use App\Models\ProductVariant;

class CartController extends Controller
{
    public function index(CartService $cartService)
    {
        $cart = $cartService->getUserCart();

        $items = collect($cart->items)->map(function ($item) {
            $variant = ProductVariant::with('product')->find($item['variant_id']);
            return [
                'variant_id' => $item['variant_id'],
                'quantity'   => $item['quantity'],
                'price'      => $item['price'],
                'image'      => $item['image'] ?? $variant->image ?? $variant->product->image,
                'name'       => $item['name'] ?? $variant->product->name,
                'stock'      => $variant->stock,
            ];
        });

        return response()->json(['items' => $items]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
        ]);

        $cart = Cart::updateOrCreate(
            ['user_id' => Auth::id()],
            ['items' => $validated['items']]
        );

        return $cart;
    }

    public function show(Cart $cart)
    {
        return $cart;
    }

    public function update(Request $request, Cart $cart)
    {
        $validated = $request->validate([
            'items' => 'required|array',
        ]);

        $cart->update($validated);

        return $cart;
    }

    public function destroy(Cart $cart)
    {
        $cart->delete();
        return response()->noContent();
    }

    // --- Item-level operations ---
    public function addItem(Request $request, CartService $cartService)
    {
        $validated = $request->validate([
            'variant_id' => 'required|exists:product_variants,id',
            'product_id' => 'required|exists:products,id',
            'name'       => 'required|string',
            'price'      => 'required|numeric',
            'quantity'   => 'required|integer|min:1',
            'image'      => 'nullable|string',
        ]);

        $cart = $cartService->addItem($validated);

        return $cart;
    }

    public function mergeGuestCart(Request $request, CartService $cartService)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.name'       => 'required|string',
            'items.*.price'      => 'required|numeric',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.image'      => 'nullable|string',
        ]);

        $cart = $cartService->getUserCart();

        foreach ($validated['items'] as $item) {
            $cartService->addItem($item);
        }

        return $cart;
    }

    public function updateItem(Request $request, $variantId, CartService $cartService)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $cartService->updateItemQuantity($variantId, $validated['quantity']);

        return $cart;
    }

    public function removeItem($variantId, CartService $cartService)
    {
        $cart = $cartService->removeItem($variantId);

        return $cart;
    }
}
