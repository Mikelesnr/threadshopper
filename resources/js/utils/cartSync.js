import axios from "axios";

export async function syncGuestCart() {
    try {
        const stored = localStorage.getItem("guest_cart");
        if (!stored) return;

        const items = JSON.parse(stored);
        if (!items || items.length === 0) return;

        // Send guest cart items to backend merge route
        const res = await axios.post("/carts/merge", { items });

        // Clear guest cart after successful merge
        localStorage.removeItem("guest_cart");

        // Optionally return merged cart items
        return res.data.items ?? [];
    } catch (error) {
        console.error("Failed to sync guest cart:", error);
    }
}
