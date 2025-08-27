import React from 'react';
import PoliciesSearch from './PoliciesSearch';
import PoliciesFilter from './PoliciesFilter';
import PoliciesSort from './PoliciesSort';
import PoliciesTable from './PoliciesTable';
import { usePoliciesManagement } from '../../../hooks/usePoliciesManagement.js';

const PoliciesManagement = () => {
    const {
        // Data
        filteredPolicies,
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
        fetchPolicies,
        createPolicy,
        updatePolicy,
        deletePolicy,

        // Utilities
        clearFilters,
        getStatistics
    } = usePoliciesManagement();

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

    // Get paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPolicies = filteredPolicies.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);

    // Get statistics
    const stats = getStatistics();

    // Error handling
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchPolicies}
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản lý chính sách cửa hàng
                    </h1>
                    <p className="text-gray-600">
                        Quản lý các chính sách của cửa hàng
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng chính sách</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalPolicies}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Kết quả lọc</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.filteredCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Hiển thị trên trang</p>
                                <p className="text-2xl font-bold text-gray-900">{paginatedPolicies.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <PoliciesSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filteredPoliciesCount={filteredPolicies.length}
                />

                {/* filter */}
                <PoliciesFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {/* Sort */}
                <PoliciesSort
                    sortConfig={sortConfig}
                    onSort={handleSort}
                />

                {/* Table */}
                <PoliciesTable
                    policies={paginatedPolicies}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredPolicies.length}
                    totalPages={totalPages}
                    onCreatePolicy={createPolicy}
                    onUpdatePolicy={updatePolicy}
                    onDeletePolicy={deletePolicy}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default PoliciesManagement;
