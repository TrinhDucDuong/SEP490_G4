// src/pages/Staff/Product/ProductManagement.jsx

import React from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import ProductSearch from './ProductSearch';
import ProductFilter from './ProductFilter';
import ProductSort from './ProductSort';
import ProductTable from './ProductTable';
import { useProductManagement } from '../../../hooks/useProductManagement';

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
            <AdminLayout>
                <div className="p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
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

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-600">Tổng sản phẩm</div>
                                <div className="text-2xl font-bold text-gray-900">{statistics.totalProducts}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-600">Đang bán</div>
                                <div className="text-2xl font-bold text-green-600">{statistics.activeProducts}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-600">Ngừng bán</div>
                                <div className="text-2xl font-bold text-red-600">{statistics.inactiveProducts}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-600">Kết quả lọc</div>
                                <div className="text-2xl font-bold text-purple-600">{statistics.filteredCount}</div>
                            </div>
                        </div>
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
