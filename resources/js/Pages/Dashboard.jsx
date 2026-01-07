import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { props } = usePage();
    const orders = props.orders || [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {orders.length === 0 ? (
                                <p className="text-gray-500">No orders yet.</p>
                            ) : (
                                <table className="w-full border">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-2">Order #</th>
                                            <th className="p-2">Amount</th>
                                            <th className="p-2">Payment</th>
                                            <th className="p-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="p-2">
                                                    {order.order_number}
                                                </td>
                                                <td className="p-2">
                                                    ${order.total_amount}
                                                </td>
                                                <td className="p-2">
                                                    {order.payment_status}
                                                </td>
                                                <td className="p-2">
                                                    {order.order_status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
