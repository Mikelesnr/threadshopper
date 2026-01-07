import { useEffect, useState } from "react";
import MarketplaceLayout from "@/Layouts/MarketplaceLayout";
import ProductCard from "@/Components/ProductCard";
import ProductModal from "@/Components/ProductModal";
import axios from "axios";

export default function Index() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const perPage = 15;
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        // Fetch products with backend pagination + filters
        axios
            .get("/products", {
                params: {
                    page,
                    per_page: perPage,
                    search: searchTerm,
                    category_id: selectedCategory,
                },
            })
            .then((res) => {
                setProducts(res.data.data);
                setMeta(res.data.meta || null);
            });

        // Fetch categories (simple list)
        axios.get("/categories").then((res) => {
            // Laravel paginator returns { data, meta, links } if paginated
            // If not paginated, just return array
            setCategories(res.data.data || res.data);
        });
    }, [page, searchTerm, selectedCategory]);

    // Reset page when search changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    // Reset page when category changes
    const handleCategorySelect = (id) => {
        setSelectedCategory(id);
        setPage(1);
    };

    const goPrev = () => {
        if (meta?.current_page > 1) setPage(meta.current_page - 1);
    };

    const goNext = () => {
        if (meta && meta.current_page < meta.last_page)
            setPage(meta.current_page + 1);
    };

    return (
        <MarketplaceLayout>
            <h1 className="text-2xl font-bold text-indigo-600 mb-6">
                Marketplace
            </h1>

            {/* Search bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border rounded px-3 py-2 w-full"
                />
            </div>

            {/* Category filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
                <button
                    onClick={() => handleCategorySelect(null)}
                    className={`px-3 py-1 rounded ${
                        selectedCategory === null
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 hover:bg-indigo-100"
                    }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`px-3 py-1 rounded ${
                            selectedCategory === cat.id
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 hover:bg-indigo-100"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={(p) => setSelectedProduct(p)}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No products found.</p>
                )}
            </div>

            {/* Pagination controls */}
            {meta && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={goPrev}
                        disabled={meta.current_page <= 1}
                        className={`px-4 py-2 rounded ${
                            meta.current_page <= 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <button
                        onClick={goNext}
                        disabled={meta.current_page >= meta.last_page}
                        className={`px-4 py-2 rounded ${
                            meta.current_page >= meta.last_page
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Product details modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </MarketplaceLayout>
    );
}
