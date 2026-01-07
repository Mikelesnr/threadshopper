import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useCart } from "@/context/CartContext"; // <-- import cart context

export default function ProductModal({ product, isOpen, onClose }) {
    if (!product) return null;

    const { addItem } = useCart(); // <-- get addItem from context
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants?.[0] ?? null
    );

    // Reset selected variant when product changes
    useEffect(() => {
        setSelectedVariant(product.variants?.[0] ?? null);
    }, [product]);

    const isInStock = (selectedVariant?.stock ?? 0) > 0;
    const imageToShow =
        selectedVariant?.image ?? product.image ?? "products/product.png";

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addItem({
            variant_id: selectedVariant.id,
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1, // default to 1
            image: imageToShow,
            stock: selectedVariant.stock,
        });

        onClose(); // optional: close modal after adding
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-30" />
                </Transition.Child>

                {/* Centered panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
                            <Dialog.Title className="text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </Dialog.Title>

                            {/* Image */}
                            <img
                                src={`/storage/${imageToShow}`}
                                alt={product.name}
                                className="w-full max-h-72 object-contain rounded-md mb-6"
                            />

                            {/* Category */}
                            {product.category?.name && (
                                <p className="text-sm text-gray-500 mb-2">
                                    Category: {product.category.name}
                                </p>
                            )}

                            {/* Description */}
                            <p className="text-gray-700 mb-4">
                                {product.description}
                            </p>

                            {/* Price */}
                            <p className="text-indigo-600 font-bold text-xl mb-2">
                                ${product.price}
                            </p>

                            {/* Variants selector */}
                            {product.variants?.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                        Select Variant:
                                    </h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() =>
                                                    setSelectedVariant(variant)
                                                }
                                                className={`px-3 py-1 rounded border ${
                                                    selectedVariant?.id ===
                                                    variant.id
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-gray-200 hover:bg-indigo-100"
                                                }`}
                                            >
                                                {variant.size
                                                    ? `Size: ${variant.size}`
                                                    : `Color: ${variant.color}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Availability */}
                            {isInStock ? (
                                <p className="text-green-600 mb-4">
                                    Available ({selectedVariant?.stock} in
                                    stock)
                                </p>
                            ) : (
                                <p className="text-red-600 mb-4">
                                    Out of Stock
                                </p>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-4 mb-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!isInStock}
                                    className={`flex-1 py-3 rounded ${
                                        isInStock
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
