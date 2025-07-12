// src/pages/Staff/Product/ProductManagement.jsx

import React from 'react';
import ProductSearch from './ProductSearch';
import ProductFilter from './ProductFilter';
import ProductSort from './ProductSort';
import ProductTable from './ProductTable';
import { useProductManagement } from '../../../hooks/useProductManagement';

const ProductManagement = () => {
    const {
        // Data - LOẠI BỎ products và fetchProducts vì không sử dụng
        filteredProducts,
        colors,
        brands,
        categories,
        loading,
        error,
        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        // Search, Filter, Sort
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,
        // Actions
        createProduct,
        updateProduct,
        deleteProduct,
        // Utilities
        clearFilters,
        getStatistics
    } = useProductManagement();

    // Handler functions
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleClearFilters = () => {
        clearFilters();
    };

    const statistics = getStatistics();

    // Error handling
    if (error) {
        return (
            <div>
                <div className="p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong>Lỗi:</strong> {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Quản lý sản phẩm
                    </h1>
                    <p className="text-gray-600">
                        Quản lý các sản phẩm và biến thể
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-600">Tổng sản phẩm</div>
                        <div className="text-2xl font-bold text-gray-900">{statistics.totalProducts}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-600">Đang bán</div>
                        <div className="text-2xl font-bold text-green-600">{statistics.activeProducts}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-600">Ngừng bán</div>
                        <div className="text-2xl font-bold text-red-600">{statistics.inactiveProducts}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-600">Kết quả lọc</div>
                        <div className="text-2xl font-bold text-blue-600">{statistics.filteredCount}</div>
                    </div>
                </div>

                {/* Search */}
                <ProductSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filteredProductsCount={filteredProducts.length}
                />

                {/* Filter */}
                <ProductFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    brands={brands}
                    categories={categories}
                />

                {/* Sort */}
                <ProductSort
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />

                {/* Table */}
                <ProductTable
                    products={filteredProducts}
                    colors={colors}
                    brands={brands}
                    categories={categories}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onCreateProduct={createProduct}
                    onUpdateProduct={updateProduct}
                    onDeleteProduct={deleteProduct}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ProductManagement;
