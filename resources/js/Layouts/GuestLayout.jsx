import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { CartProvider, useCart } from "@/context/CartContext";
import CartModal from "@/Components/CartModal";

function LayoutContent({ children }) {
    const { cart } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="flex flex-col items-center">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    View Cart
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>

            {/* Cart Modal */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </div>
    );
}

export default function GuestLayout({ children }) {
    return (
        <CartProvider>
            <LayoutContent>{children}</LayoutContent>
        </CartProvider>
    );
}
