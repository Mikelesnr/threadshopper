// resources/js/Components/CheckoutComponent.jsx
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function CheckoutComponent({ user }) {
    const { cart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [message, setMessage] = useState(null);

    const [deliveryAddress, setDeliveryAddress] = useState({
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
    });

    const [checkoutItems, setCheckoutItems] = useState([]);

    useEffect(() => {
        const normalized = cart.map((item) => ({
            // ✅ use product_variant_id consistently
            product_variant_id: item.product_variant_id ?? item.variant_id,
            quantity: item.quantity,
            price: Number(item.price),
            subtotal: Number((item.price * item.quantity).toFixed(2)),
        }));
        setCheckoutItems(normalized);
    }, [cart]);

    const subtotal = checkoutItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handlePlaceOrder = async () => {
        if (checkoutItems.length === 0 || !user) return;

        setLoading(true);
        try {
            const orderNumber = "ORD-" + Date.now();
            const shippingAddress =
                `${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.country}`.trim();

            const payload = {
                order_number: orderNumber,
                total_amount: Number(subtotal.toFixed(2)),
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                items: checkoutItems,
            };

            console.log("Submitting payload:", payload);

            const res = await axios.post("/orders", payload);
            const order = res.data;

            clearCart();

            if (paymentMethod === "paynow") {
                router.visit(`/payment/${order.id}`);
            } else {
                router.visit("/dashboard");
            }
        } catch (err) {
            console.error("Checkout error:", err.response?.data || err);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <p className="text-gray-500">
                You must{" "}
                <a href="/login" className="text-indigo-600">
                    log in
                </a>{" "}
                to checkout.
            </p>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-indigo-600 mb-6">
                Review Your Order
            </h1>

            <div className="mb-6">
                {checkoutItems.length > 0 ? (
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Variant ID</th>
                                <th className="p-2">Qty</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkoutItems.map((item, index) => (
                                <tr key={`${item.product_variant_id}-${index}`}>
                                    <td className="p-2">
                                        {item.product_variant_id}
                                    </td>
                                    <td className="p-2 text-center">
                                        {item.quantity}
                                    </td>
                                    <td className="p-2">${item.price}</td>
                                    <td className="p-2">
                                        $
                                        {(item.price * item.quantity).toFixed(
                                            2
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">Your cart is empty.</p>
                )}
                <div className="text-right mt-4 font-bold">
                    Subtotal: ${subtotal.toFixed(2)}
                </div>
            </div>

            {/* Delivery address */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Delivery address</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Street address"
                        value={deliveryAddress.address}
                        onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                                ...prev,
                                address: e.target.value,
                            }))
                        }
                        className="border rounded px-3 py-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={deliveryAddress.city}
                        onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                                ...prev,
                                city: e.target.value,
                            }))
                        }
                        className="border rounded px-3 py-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        value={deliveryAddress.country}
                        onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                                ...prev,
                                country: e.target.value,
                            }))
                        }
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    We’ll deliver to this address. You can edit it above.
                </p>
            </div>

            {/* Payment method selector */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">
                    Select Payment Method
                </h2>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="border rounded px-3 py-2 w-full mb-3"
                >
                    <option value="cod">Cash on Delivery</option>
                    <option value="paynow">PayNow (Digital)</option>
                </select>
            </div>

            <button
                onClick={handlePlaceOrder}
                disabled={loading || checkoutItems.length === 0}
                className={`px-6 py-2 rounded ${
                    loading || checkoutItems.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
                {loading ? "Placing Order..." : "Place Order"}
            </button>

            {message && (
                <p className="mt-4 text-center text-red-600 font-semibold">
                    {message}
                </p>
            )}
        </div>
    );
}
