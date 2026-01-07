import { useEffect, useState } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";

export default function Payment() {
    const { props } = usePage();
    const order = props.order;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initiate = async () => {
            try {
                const res = await axios.post(`/orders/${order.id}/paynow`);
                window.location.href = res.data.redirect_url;
            } catch (err) {
                console.error("Paynow initiation failed", err);
            } finally {
                setLoading(false);
            }
        };
        if (order.payment_method === "paynow") {
            initiate();
        }
    }, [order]);

    return (
        <div className="p-6 text-center">
            {loading ? (
                <p className="text-indigo-600">Redirecting to Paynow...</p>
            ) : (
                <p className="text-red-600">Failed to redirect to Paynow.</p>
            )}
        </div>
    );
}
