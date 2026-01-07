import MarketplaceLayout from "@/Layouts/MarketplaceLayout";
import { usePage } from "@inertiajs/react";

function Show() {
    const { product } = usePage().props;

    return (
        <MarketplaceLayout>
            <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
                <img
                    src={`/storage/${product.image ?? "products/product.png"}`}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-md mb-6"
                />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.name}
                </h1>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-indigo-600 font-bold text-xl mb-6">
                    ${product.price}
                </p>
                <button className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700">
                    Add to Cart
                </button>
            </div>
        </MarketplaceLayout>
    );
}

export default Show;
