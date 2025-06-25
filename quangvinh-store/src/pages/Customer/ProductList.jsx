import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFetchFilteredProducts } from '../../hooks/useFetchFilteredProducts.js';
import ProductCard from '../../components/ui/product/ProductCard.jsx';
import ProductFilter from '../../components/ui/product/ProductFilter.jsx';
import Banner from '../../components/ui/home/Banner.jsx';
import { useFetchCategories } from '../../hooks/useFetchCategories.js';

const ProductList = () => {
    const { categories, loading: categoriesLoading, error: categoriesError } = useFetchCategories();

    const [filterOptions, setFilterOptions] = useState({
        genders: [],
        brands: [],
        collections: [],
        materials: [],
        sizes: [],
        colors: [],
        categories: [],
        sortBy: 'createdAt',
        sortDirection: 'desc',
        pageNumber: 0,
        pageSize: 10
    });

    const [sortOption, setSortOption] = useState('price-low-to-high');
    const productListRef = useRef(null);

    const {
        products,
        loading: productsLoading,
        error: productsError
    } = useFetchFilteredProducts(filterOptions);

    useEffect(() => {
        if (products.length > 0) {
            productListRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [products]);

    useEffect(() => {
        if (sortOption === 'price-low-to-high') {
            setFilterOptions(prev => ({
                ...prev,
                sortBy: 'unitPrice',
                sortDirection: 'asc'
            }));
        } else if (sortOption === 'price-high-to-low') {
            setFilterOptions(prev => ({
                ...prev,
                sortBy: 'unitPrice',
                sortDirection: 'desc'
            }));
        }
    }, [sortOption]);

    if (productsLoading || categoriesLoading) {
        return <div className="text-center py-10 text-gray-600">Đang tải...</div>;
    }

    if (productsError || categoriesError) {
        return <div className="text-center py-10 text-red-500">Lỗi: {productsError || categoriesError}</div>;
    }

    return (
        <div className="bg-[#FFF] min-h-screen px-4 sm:px-8 py-12">
            {products.length > 0 && (
                <Banner
                    index={1}
                    item={products[0]}
                    link={`/products/${products[0].productId}`}
                />
            )}

            <div className="flex flex-col text-sm sm:flex-row items-center mb-6 opacity-50 gap-2 mt-8">
                <Link className="text-black hover:text-yellow-400 transition" to="/home">TRANG CHỦ</Link>
                <span>\</span>
                <Link className="text-black hover:text-yellow-400 transition" to="/products">SẢN PHẨM</Link>
            </div>

            <h1 className="text-5xl font-bold text-gray-800 mb-6">Tất cả sản phẩm</h1>

            <div className="container mx-auto flex gap-6">
                <div className="w-full lg:w-1/4">
                    <ProductFilter
                        categories={categories}
                        filterOptions={filterOptions}
                        setFilterOptions={setFilterOptions}
                    />
                </div>

                <div className="w-full lg:w-3/4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <select
                            value={sortOption}
                            onChange={e => setSortOption(e.target.value)}
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="price-low-to-high">Giá: Thấp đến Cao</option>
                            <option value="price-high-to-low">Giá: Cao đến Thấp</option>
                        </select>
                    </div>

                    {products.length === 0 ? (
                        <p className="text-center text-gray-600 mt-8">Không có sản phẩm nào phù hợp với bộ lọc.</p>
                    ) : (
                        <div
                            ref={productListRef}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {products.map(product => (
                                <Link
                                    key={product.productId}
                                    to={`/products/${product.productId}`}
                                    state={{ product }}
                                >
                                    <ProductCard product={product} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;