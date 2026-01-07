<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\OrderStatusEnum;
use App\Services\PaynowService;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with('items')->get();
    }

    public function myOrders()
    {
        // Customer: return only orders for the authenticated user
        return Order::with('items')
            ->where('user_id', Auth::id())
            ->get();
    }

    public function store(Request $request, PaynowService $paynow)
    {
        $validated = $request->validate([
            'order_number'        => 'required|string|unique:orders,order_number',
            'total_amount'        => 'required|numeric',
            'shipping_address'    => 'required|string',
            'payment_method'      => 'required|in:' . implode(',', [
                PaymentMethodEnum::COD->value,
                PaymentMethodEnum::PAYNOW->value,
            ]),
            'items'               => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity'    => 'required|integer|min:1',
            'items.*.price'       => 'required|numeric',
            'items.*.subtotal'    => 'required|numeric',
        ]);

        $validated['user_id'] = Auth::id();

        if ($validated['payment_method'] === PaymentMethodEnum::COD->value) {
            $validated['order_status']   = OrderStatusEnum::PENDING->value;
            $validated['payment_status'] = PaymentStatusEnum::PENDING->value;
        } else {
            $validated['order_status']   = OrderStatusEnum::PROCESSING->value;
            $validated['payment_status'] = PaymentStatusEnum::PENDING->value;
        }

        $items = $validated['items'];
        unset($validated['items']);

        $order = Order::create($validated);

        foreach ($items as $item) {
            $variant = ProductVariant::findOrFail($item['product_variant_id']);

            $order->items()->create([
                'product_variant_id' => $variant->id,
                'product_id'         => $variant->product_id,
                'quantity'           => $item['quantity'],
                'price'              => $item['price'],
                'subtotal'           => $item['subtotal'],
            ]);
        }

        // ✅ Branch for Paynow
        if ($order->payment_method === PaymentMethodEnum::PAYNOW->value) {
            try {
                $redirectUrl = $paynow->initiatePayment($order);

                return response()->json([
                    'order'        => $order->load('items'),
                    'redirect_url' => $redirectUrl,
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Failed to initiate Paynow payment',
                    'details' => $e->getMessage(),
                ], 500);
            }
        }

        // COD orders return normally
        return response()->json($order->load('items'));
    }

    public function show(Order $order)
    {
        return response()->json($order->load('items'));
    }

    public function update(Request $request, Order $order)
    {
        $order->update($request->all());
        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->noContent();
    }
}
