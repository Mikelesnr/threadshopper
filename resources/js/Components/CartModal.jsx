import { useCart } from "@/context/CartContext";

export default function CartModal({ isOpen, onClose }) {
    const { cart, updateItem, removeItem } = useCart(); // <-- use global context

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
            <div className="bg-white w-full sm:w-96 h-full overflow-y-auto shadow-lg p-4">
                <button onClick={onClose} className="text-gray-500 mb-4">
                    Close ✕
                </button>
                <h2 className="text-xl font-bold mb-4">Your Cart</h2>

                {!cart || cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cart.map((item) => (
                        <div
                            key={item.variant_id}
                            className="flex justify-between items-center mb-4"
                        >
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p>
                                    ${item.price} × {item.quantity}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        updateItem(
                                            item.variant_id,
                                            item.quantity - 1
                                        )
                                    }
                                    disabled={item.quantity <= 1}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    –
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        updateItem(
                                            item.variant_id,
                                            item.quantity + 1
                                        )
                                    }
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeItem(item.variant_id)}
                                    className="text-red-500 ml-2"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}

                <div className="mt-6">
                    <a
                        href="/checkout"
                        className="block w-full bg-indigo-600 text-white text-center py-2 rounded hover:bg-indigo-700"
                    >
                        Go to Checkout
                    </a>
                </div>
            </div>
        </div>
    );
}
