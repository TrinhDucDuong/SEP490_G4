import React, { useState, useMemo } from 'react';
import { useFetchProducts } from '../hooks/useFetch';
import ProductCard from '../components/ui/ProductCard.jsx';
import Carousel from '../components/ui/Carousel.jsx';

const ProductList = () => {
    const { products, loading, error } = useFetchProducts();
    const [page, setPage] = useState(1);
    const productsPerPage = 12;

    const paginatedProducts = useMemo(() => {
        return products.slice(0, page * productsPerPage).map(product => ({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.thumbnail,
            images: product.images,
            rating: product.rating,
            reviews: product.reviews,
        }));
    }, [products, page]);

    if (loading) return (
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

    if (error) return (
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

    return (
        <div className="bg-[#F2F2EE]">
            <Carousel />
            <div className="mx-4 my-6">
                <h2 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {paginatedProducts.length < products.length && (
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