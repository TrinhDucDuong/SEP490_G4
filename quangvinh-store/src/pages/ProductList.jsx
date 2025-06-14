import React, { useState, useMemo } from 'react';
import { useFetchProducts } from '../hooks/useFetch';
import ProductCard from '../components/ui/ProductCard.jsx';
import Carousel from '../components/ui/Carousel.jsx';
import ProductFilter from '../components/ui/ProductFilter.jsx';
import { AnimatePresence } from 'framer-motion';

const ProductList = () => {
    const { products, loading, error } = useFetchProducts();
    const [page, setPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        category: 'all',
        priceRange: [0, 1000],
    });
    const productsPerPage = 12;

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            (filterOptions.category === 'all' || product.category === filterOptions.category) &&
            product.price >= filterOptions.priceRange[0] &&
            product.price <= filterOptions.priceRange[1]
        );
    }, [products, filterOptions]);

    const paginatedProducts = useMemo(() => {
        return filteredProducts
            .slice(0, page * productsPerPage)
            .map(product => ({
                id: product.id,
                name: product.title,
                price: product.price,
                image: product.thumbnail,
                images: product.images,
                rating: product.rating,
                reviews: product.reviews,
            }));
    }, [filteredProducts, page]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
                        <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center my-6 text-red-500">
                <p>Đã xảy ra lỗi: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#F2F2EE]">
            <Carousel />
            <div className="mx-4 my-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Tất cả sản phẩm</h2>
                    <button
                        className="bg-white border rounded-md px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setShowFilter(true)}
                    >
                        <span>Lọc & Sắp xếp</span>
                    </button>
                </div>

                <AnimatePresence>
                    {showFilter && (
                        <>
                            <div
                                className="fixed inset-0 bg-black bg-opacity-40 z-40"
                                onClick={() => setShowFilter(false)}
                            />
                            <ProductFilter
                                initialOptions={filterOptions}
                                onClose={() => setShowFilter(false)}
                                onApply={(options) => {
                                    setFilterOptions(options);
                                    setPage(1);
                                    setShowFilter(false);
                                }}
                                popularProducts={products.slice(0, 4)}
                            />
                        </>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {paginatedProducts.length < filteredProducts.length && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setPage(page + 1)}
                            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                        >
                            Tải thêm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
