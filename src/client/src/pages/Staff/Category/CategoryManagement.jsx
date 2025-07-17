// src/pages/Staff/Category/CategoryManagement.jsx
import React from 'react';
import CategorySearch from './CategorySearch';
import CategoryFilter from './CategoryFilter';
import CategorySort from './CategorySort';
import CategoryTable from './CategoryTable';
import { useCategoryManagement } from '../../../hooks/useCategoryManagement';

const CategoryManagement = () => {
    const {
        // Data
        filteredCategories,
        parentCategories,
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
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,

        // Utilities
        clearFilters,
        getStatistics
    } = useCategoryManagement();

    // Handler functions - ĐỒNG NHẤT với Brand
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
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

    // Error handling - ĐỒNG NHẤT với Brand
    if (error) {
        return (
                <div className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">Lỗi: {error}</p>
                        <button
                            onClick={fetchCategories}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
        );
    }

    return (
        <div>
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục sản phẩm</h1>
                    <p className="text-gray-600 mt-2">
                        Quản lý các danh mục sản phẩm
                    </p>
                </div>

                {/* Statistics Cards - ĐỒNG NHẤT với Brand */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Tổng danh mục</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.totalCategories}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Đang bán</p>
                                <p className="text-2xl font-bold text-green-600">{statistics.activeCategories}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Ngừng bán</p>
                                <p className="text-2xl font-bold text-red-600">{statistics.inactiveCategories}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Kết quả lọc</p>
                                <p className="text-2xl font-bold text-blue-600">{statistics.filteredCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Component */}
                <CategorySearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filteredCategoriesCount={filteredCategories.length}
                />

                {/* Filter Component */}
                <CategoryFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    parentCategories={parentCategories}
                />

                {/* Sort Component */}
                <CategorySort
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />

                {/* Table Component */}
                <CategoryTable
                    categories={filteredCategories}
                    parentCategories={parentCategories}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onCreateCategory={createCategory}
                    onUpdateCategory={updateCategory}
                    onDeleteCategory={deleteCategory}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default CategoryManagement;
