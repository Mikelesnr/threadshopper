<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Enums\PaymentStatusEnum;
use App\Enums\OrderStatusEnum;
use App\Services\PaynowService;

class PaynowController extends Controller
{
    /**
     * Handle Paynow server-to-server notification (Result URL).
     */
    public function handleResult(Request $request, PaynowService $paynow)
    {
        // Paynow sends "reference" = your order_number
        $orderNumber = $request->input('reference');
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        $status = $paynow->checkStatus($order);

        if ($status && $status->paid()) {
            $order->update([
                'payment_status' => PaymentStatusEnum::PAID->value,
                'order_status'   => OrderStatusEnum::PROCESSING->value, // or CONFIRMED if you add that enum
            ]);

            Payment::updateOrCreate(
                ['order_id' => $order->id, 'method' => 'paynow'],
                [
                    'amount'       => $order->total_amount,
                    'status'       => PaymentStatusEnum::PAID->value,
                    'reference'    => $order->order_number,
                    'raw_response' => $status->data(),
                ]
            );
        } elseif ($status && strtolower($status->status()) === 'awaiting delivery') {
            // Treat "Awaiting Delivery" as pending
            $order->update([
                'payment_status' => PaymentStatusEnum::PENDING->value,
            ]);

            Payment::updateOrCreate(
                ['order_id' => $order->id, 'method' => 'paynow'],
                [
                    'amount'       => $order->total_amount,
                    'status'       => PaymentStatusEnum::PENDING->value,
                    'reference'    => $order->order_number,
                    'raw_response' => $status->data(),
                ]
            );
        } else {
            $order->update([
                'payment_status' => PaymentStatusEnum::FAILED->value,
                'order_status'   => OrderStatusEnum::CANCELLED->value,
            ]);

            Payment::updateOrCreate(
                ['order_id' => $order->id, 'method' => 'paynow'],
                [
                    'amount'       => $order->total_amount,
                    'status'       => PaymentStatusEnum::FAILED->value,
                    'reference'    => $order->order_number,
                    'raw_response' => $status ? $status->data() : [],
                ]
            );
        }

        return response()->json(['message' => 'Result processed']);
    }

    /**
     * Handle Paynow redirect after user completes payment (Return URL).
     */
    public function handleReturn(Request $request)
    {
        $orderNumber = $request->input('reference');
        $order = Order::where('order_number', $orderNumber)->first();

        if (!$order) {
            return redirect()->route('orders.index')
                ->with('error', 'Order not found');
        }

        if ($order->payment_status === PaymentStatusEnum::PAID->value) {
            return redirect()->route('orders.show', $order)
                ->with('success', 'Payment successful!');
        }

        if ($order->payment_status === PaymentStatusEnum::PENDING->value) {
            return redirect()->route('orders.show', $order)
                ->with('warning', 'Payment is still pending.');
        }

        return redirect()->route('orders.show', $order)
            ->with('error', 'Payment failed or cancelled.');
    }
}
