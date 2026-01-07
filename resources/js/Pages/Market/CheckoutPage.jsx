import MarketplaceLayout from "@/Layouts/MarketplaceLayout";
import CheckoutComponent from "@/Components/CheckoutComponent";
import { usePage } from "@inertiajs/react";

export default function CheckoutPage() {
    const { auth } = usePage().props;

    return (
        <MarketplaceLayout>
            <CheckoutComponent user={auth.user} />
        </MarketplaceLayout>
    );
}
