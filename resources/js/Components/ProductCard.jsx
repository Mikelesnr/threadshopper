export default function ProductCard({ product, onClick }) {
    // Availability based on variants
    const totalStock = Array.isArray(product.variants)
        ? product.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)
        : 0;

    const isInStock = totalStock > 0;

    const truncatedDescription =
        product.description && product.description.length > 60
            ? product.description.substring(0, 60) + "..."
            : product.description || "";

    return (
        <div
            onClick={() => onClick(product)}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col h-full cursor-pointer"
        >
            <img
                src={`/storage/${product.image ?? "products/product.png"}`}
                alt={product.name}
                className="h-48 w-full object-cover rounded-md"
            />

            <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {product.name}
            </h3>

            {/* Category (safe if not loaded) */}
            {product.category?.name && (
                <p className="text-xs text-gray-500 mt-1">
                    Category: {product.category.name}
                </p>
            )}

            <p className="text-gray-600 flex-grow mt-2">
                {truncatedDescription}
            </p>

            {/* Footer pinned to bottom with margin */}
            <div className="mt-auto mb-4">
                <p className="text-indigo-600 font-bold">${product.price}</p>

                {/* Availability messaging */}
                {isInStock ? (
                    <p className="text-green-600 text-sm mb-2">
                        Available ({totalStock} in stock)
                    </p>
                ) : (
                    <p className="text-red-600 text-sm mb-2">Out of Stock</p>
                )}

                {/* Add to Cart (disabled when unavailable) */}
                <button
                    disabled={!isInStock}
                    className={`w-full py-2 rounded ${
                        isInStock
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
