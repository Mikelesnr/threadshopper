import { createContext, useContext, useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { auth } = usePage().props;
    const [cart, setCart] = useState([]);

    // Load cart depending on auth state
    useEffect(() => {
        if (!auth?.user) {
            const stored = localStorage.getItem("guest_cart");
            setCart(stored ? JSON.parse(stored) : []);
        } else {
            axios
                .get("/carts")
                .then((res) => setCart(res.data.items ?? []))
                .catch(() => setCart([]));
        }
    }, [auth]);

    // Persist guest cart only if not logged in
    useEffect(() => {
        if (!auth?.user) {
            localStorage.setItem("guest_cart", JSON.stringify(cart));
        }
    }, [cart, auth]);

    // Helper: delayed refresh after optimistic update
    const refreshCart = () => {
        setTimeout(async () => {
            try {
                const res = await axios.get("/carts");
                setCart(res.data.items ?? []);
            } catch {
                setCart([]);
            }
        }, 1500);
    };

    const addItem = async (item) => {
        const qty = Number(item.quantity) || 0;
        const stock = Number(item.stock) || qty;

        const normalizedItem = {
            ...item,
            product_variant_id:
                item.product_variant_id ?? item.variant_id ?? item.id,
            quantity: Math.min(qty, stock),
            stock,
            image: item.image,
        };

        if (auth?.user) {
            // Optimistic update
            setCart((prev) => {
                const existing = prev.find(
                    (i) =>
                        i.product_variant_id ===
                        normalizedItem.product_variant_id
                );
                if (existing) {
                    const newQty = Math.min(
                        Number(existing.quantity) + qty,
                        Number(existing.stock) || stock
                    );
                    return prev.map((i) =>
                        i.product_variant_id ===
                        normalizedItem.product_variant_id
                            ? {
                                  ...i,
                                  quantity: newQty,
                                  image: i.image ?? normalizedItem.image,
                              }
                            : i
                    );
                }
                return [...prev, normalizedItem];
            });

            try {
                await axios.post("/carts/items", normalizedItem);
            } catch (err) {
                console.error("Add failed", err);
            }

            refreshCart();
        } else {
            // Guest cart logic
            setCart((prev) => {
                const existing = prev.find(
                    (i) =>
                        i.product_variant_id ===
                        normalizedItem.product_variant_id
                );
                if (existing) {
                    const newQty = Math.min(
                        Number(existing.quantity) + qty,
                        Number(existing.stock) || stock
                    );
                    return prev.map((i) =>
                        i.product_variant_id ===
                        normalizedItem.product_variant_id
                            ? {
                                  ...i,
                                  quantity: newQty,
                                  image: i.image ?? normalizedItem.image,
                              }
                            : i
                    );
                }
                return [...prev, normalizedItem];
            });
        }
    };

    const updateItem = async (variantId, quantity) => {
        const qty = Number(quantity) || 0;

        setCart((prev) =>
            prev.map((i) =>
                i.product_variant_id === variantId
                    ? {
                          ...i,
                          quantity: Math.min(qty, Number(i.stock) || qty),
                          image: i.image,
                      }
                    : i
            )
        );

        if (auth?.user) {
            try {
                await axios.put(`/carts/items/${variantId}`, { quantity: qty });
            } catch (err) {
                console.error("Update failed", err);
            }
            refreshCart();
        }
    };

    const removeItem = async (variantId) => {
        setCart((prev) =>
            prev.filter((i) => i.product_variant_id !== variantId)
        );

        if (auth?.user) {
            try {
                await axios.delete(`/carts/items/${variantId}`);
            } catch (err) {
                console.error("Remove failed", err);
            }
            refreshCart();
        }
    };

    // ✅ Add clearCart
    const clearCart = () => {
        setCart([]);
        if (!auth?.user) {
            localStorage.removeItem("guest_cart");
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, addItem, updateItem, removeItem, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
