import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFetchFilteredProducts } from '../../hooks/useFetchFilteredProducts.js';
import ProductCard from '../../components/ui/product/ProductCard.jsx';
import ProductFilter from '../../components/ui/product/ProductFilter.jsx';
import Banner from '../../components/ui/home/Banner.jsx';
import { useFetchCategories } from '../../hooks/useFetchCategories.js';
import Breadcrumb from "../../components/common/Breadcrumb.jsx";

const parseSearchParamsToFilterOptions = (searchParams) => {
    const getArrayParam = (key) => {
        const value = searchParams.get(key);
        return value ? value.split(',') : [];
    };

    return {
        genders: getArrayParam('genders'),
        brands: getArrayParam('brands'),
        materials: getArrayParam('materials'),
        sizes: getArrayParam('sizes'),
        colors: getArrayParam('colors'),
        categories: getArrayParam('categories'),
        priceMin: parseInt(searchParams.get('priceMin')) || 150000,
        priceMax: parseInt(searchParams.get('priceMax')) || 3000000,
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortDirection: searchParams.get('sortDirection') || 'desc',
        pageNumber: parseInt(searchParams.get('pageNumber')) || 0,
        pageSize: parseInt(searchParams.get('pageSize')) || 30,
    };
};

const ProductList = () => {
    const { categories, loading: categoriesLoading, error: categoriesError } = useFetchCategories();
    const [searchParams, setSearchParams] = useSearchParams();
    const filterOptions = parseSearchParamsToFilterOptions(searchParams);

    const [sortOption, setSortOption] = useState(() => {
        if (filterOptions.sortBy === 'unitPrice' && filterOptions.sortDirection === 'asc') return 'price-low-to-high';
        if (filterOptions.sortBy === 'unitPrice' && filterOptions.sortDirection === 'desc') return 'price-high-to-low';
        if (filterOptions.sortBy === 'totalSoldOut') return 'bestseller';
        return 'newest';
    });

    const productListRef = useRef(null);

    const {
        products,
        loading: productsLoading,
        error: productsError
    } = useFetchFilteredProducts();

    useEffect(() => {
        if (products.length > 0) {
            productListRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [products]);

    useEffect(() => {
        const updated = Object.fromEntries(searchParams.entries());

        switch (sortOption) {
            case 'price-low-to-high':
                updated.sortBy = 'unitPrice';
                updated.sortDirection = 'asc';
                break;
            case 'price-high-to-low':
                updated.sortBy = 'unitPrice';
                updated.sortDirection = 'desc';
                break;
            case 'newest':
                updated.sortBy = 'createdAt';
                updated.sortDirection = 'desc';
                break;
            case 'bestseller':
                updated.sortBy = 'totalSoldOut';
                updated.sortDirection = 'desc';
                break;
            default:
                break;
        }

        updated.pageNumber = 0;
        setSearchParams(updated);
    }, [sortOption]);

    if (productsLoading || categoriesLoading) {
        return <div className="text-center py-10 text-gray-600">Đang tải...</div>;
    }

    if (productsError || categoriesError) {
        return <div className="text-center py-10 text-red-500">Lỗi: {productsError || categoriesError}</div>;
    }

    return (
        <div className="bg-[#FFF] min-h-screen px-24 py-12">

            {products.length > 0 && (
                <Banner
                    index={1}
                    item={products[0]}
                    link={`/products/${products[0].productId}`}
                />
            )}
            <Breadcrumb
                items={[
                    { label: "Trang chủ", to: "/" },
                    { label: "Sản phẩm", to: "/cart" },
                ]}
            />
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Tất cả sản phẩm</h1>

            <div className="container mx-auto flex gap-6">
                <div className="w-full lg:w-1/4">
                    <ProductFilter categories={categories} />
                </div>

                <div className="w-full lg:w-3/4">
                    <div className="flex justify-end mb-6">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="bestseller">Bán chạy nhất</option>
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
