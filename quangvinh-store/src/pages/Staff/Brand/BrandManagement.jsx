import React from 'react';
import BrandSearch from './BrandSearch';
import BrandFilter from './BrandFilter';
import BrandSort from './BrandSort';
import BrandTable from './BrandTable.jsx';
import { useBrandManagement } from '../../../hooks/useBrandManagement';

const BrandManagement = () => {
    const {
        // Data
        brands,
        filteredBrands,
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
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand,

        // Utilities
        clearFilters
    } = useBrandManagement();

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

    // Error handling
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-lg font-medium mb-2">Có lỗi xảy ra</div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <button
                        onClick={fetchBrands}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý thương hiệu</h1>
                    <p className="text-gray-600 mt-2">
                        Quản lý các thương hiệu sản phẩm
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Tổng thương hiệu</p>
                                <p className="text-2xl font-bold text-gray-900">{brands.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Đang bán</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {brands.filter(b => b.isActive).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Ngừng bán</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {brands.filter(b => !b.isActive).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">Kết quả lọc</p>
                                <p className="text-2xl font-bold text-blue-600">{filteredBrands.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        {/* Search */}
                        <BrandSearch
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            filteredBrandsCount={filteredBrands.length}
                        />

                        {/* Filters */}
                        <BrandFilter
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                        />

                        {/* Sort */}
                        <BrandSort
                            sortConfig={sortConfig}
                            onSort={handleSort}
                        />

                        {/* Table */}
                        <BrandTable
                            brands={filteredBrands}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onCreateBrand={createBrand}
                            onUpdateBrand={updateBrand}
                            onDeleteBrand={deleteBrand}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandManagement;
