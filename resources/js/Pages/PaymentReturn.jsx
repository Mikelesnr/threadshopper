import { usePage } from "@inertiajs/react";

export default function PaymentReturn() {
    const { props } = usePage();
    const { status, message } = props;

    return (
        <div className="max-w-lg mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
            <p
                className={`text-lg ${
                    status === "paid"
                        ? "text-green-600"
                        : status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                }`}
            >
                {message}
            </p>
        </div>
    );
}
