// src/pages/staff/product/ProductManagement.jsx

import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import ProductSearch from './ProductSearch';
import ProductFilter from './ProductFilter';
import ProductSort from './ProductSort';
import ProductTable from './ProductTable';
import { useProductManagement } from '../../../hooks/admin/useProductManagement.js';

const ProductManagement = () => {
    const {
        // Data
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
        // Search, filter, Sort
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
        viewProduct, // THÊM này
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
            <AdminLayout>
                <div className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <div>
            <div>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Quản lý sản phẩm
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý các sản phẩm và biến thể trong hệ thống
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Tổng sản phẩm</h3>
                        <p className="text-2xl font-bold text-gray-900">{statistics.totalProducts}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Đang bán</h3>
                        <p className="text-2xl font-bold text-green-600">{statistics.activeProducts}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Ngừng bán</h3>
                        <p className="text-2xl font-bold text-red-600">{statistics.inactiveProducts}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Thương hiệu</h3>
                        <p className="text-2xl font-bold text-blue-600">{statistics.totalBrands}</p>
                    </div>
                </div>

                {/* Search */}
                <ProductSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filteredProductsCount={filteredProducts.length}
                />

                {/* Filters and Sort */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <ProductFilter
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                            brands={brands}
                            categories={categories}
                        />
                    </div>
                </div>
                <div>
                    <ProductSort
                        sortConfig={sortConfig}
                        onSort={handleSort}
                    />
                </div>
                {/* Products Table */}
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
                    onViewProduct={viewProduct} // THÊM prop này
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ProductManagement;
