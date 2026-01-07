import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import CartModal from "@/Components/CartModal"; // <-- new modal component

function LayoutContent({ auth, children }) {
    const { cart } = useCart();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false); // <-- modal state

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="h-10 w-auto text-indigo-600" />
                        </Link>
                        <h1 className="ml-3 text-xl font-bold text-indigo-600">
                            ThreadShopper
                        </h1>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex space-x-6 items-center">
                        <NavLink
                            href="/market"
                            active={route().current("market")}
                        >
                            Market
                        </NavLink>
                        <NavLink
                            href="/dashboard"
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </NavLink>

                        {/* View Cart button (opens modal) */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            View Cart
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {auth.user && (
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-indigo-600 focus:outline-none transition"
                                        >
                                            {auth.user.name}
                                            <svg
                                                className="ml-2 -mr-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href="/profile">
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>

            {/* Cart Modal */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </div>
    );
}

export default function MarketplaceLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <CartProvider>
            <LayoutContent auth={auth}>{children}</LayoutContent>
        </CartProvider>
    );
}
