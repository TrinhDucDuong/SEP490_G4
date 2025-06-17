import React, { useState, useMemo } from 'react';
import { useFetchProducts, useFetchCategories } from '../hooks/useFetch';
import ProductCard from '../components/ui/ProductCard.jsx';
import Filter from '../components/ui/ProductFilter.jsx';

const ProductList = () => {
    const { products, loading: productsLoading, error: productsError } = useFetchProducts();
    const { categories, loading: categoriesLoading, error: categoriesError } = useFetchCategories();
    const [filterOptions, setFilterOptions] = useState({
        category: 'all',
        priceRange: [0, 1000],
        brand: 'all',
        color: 'all',
        size: 'all',
    });
    const [sortOption, setSortOption] = useState('price-low-to-high');

    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            return (
                (filterOptions.category === 'all' || product.category === filterOptions.category) &&
                product.price >= filterOptions.priceRange[0] &&
                product.price <= filterOptions.priceRange[1] &&
                (filterOptions.brand === 'all' || product.brand === filterOptions.brand) &&
                (filterOptions.color === 'all' || product.color === filterOptions.color) &&
                (filterOptions.size === 'all' || product.size === filterOptions.size)
            );
        });

        if (sortOption === 'price-low-to-high') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high-to-low') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, filterOptions, sortOption]);

    if (productsLoading || categoriesLoading) {
        return <div className="text-center py-10 text-gray-600">Đang tải...</div>;
    }

    if (productsError || categoriesError) {
        return (
            <div className="text-center py-10 text-red-500">
                Lỗi: {productsError || categoriesError}
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen px-4 sm:px-8 py-12">
            <div className="container mx-auto flex gap-6">
                <div className="w-full lg:w-1/4">
                    <Filter
                        categories={['all', ...categories]}
                        setFilterOptions={setFilterOptions}
                        filterOptions={filterOptions}
                    />
                </div>
                <div className="w-full lg:w-3/4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h2>
                        <select
                            value={sortOption}
                            onChange={e => setSortOption(e.target.value)}
                            className="mt-2 sm:mt-0 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="price-low-to-high">Giá: Thấp đến Cao</option>
                            <option value="price-high-to-low">Giá: Cao đến Thấp</option>
                        </select>
                    </div>
                    {filteredProducts.length === 0 ? (
                        <p className="text-center text-gray-600 mt-8">
                            Không có sản phẩm nào phù hợp với bộ lọc.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;