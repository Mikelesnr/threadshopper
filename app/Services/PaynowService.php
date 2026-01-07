<?php

namespace App\Services;

use Paynow\Payments\Paynow;

class PaynowService
{
    protected $paynow;

    public function __construct()
    {
        $this->paynow = new Paynow(
            config('services.paynow.integration_id'),
            config('services.paynow.integration_key'),
            config('services.paynow.result_url'),
            config('services.paynow.return_url')
        );
    }

    public function initiatePayment($order)
    {
        $payment = $this->paynow->createPayment(
            $order->order_number,
            $order->user->email
        );

        foreach ($order->items as $item) {
            $payment->add($item->product->name, $item->subtotal);
        }

        $response = $this->paynow->send($payment);

        if ($response->success()) {
            $order->update(['poll_url' => $response->pollUrl()]);
            return $response->redirectUrl();
        }

        // ✅ Use data() instead of error()
        throw new \Exception('Paynow initiation failed. Response: ' . json_encode($response->data()));
    }

    public function checkStatus($order)
    {
        if (!$order->poll_url) {
            return null;
        }

        return $this->paynow->pollTransaction($order->poll_url);
    }
}
