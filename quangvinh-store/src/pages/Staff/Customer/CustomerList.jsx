import React from 'react';
import CustomerSearch from './CustomerSearch';
import CustomerSort from './CustomerSort';
import CustomerTable from './CustomerTable';
import {useCustomerList} from '../../../hooks/useCustomerList';

const CustomerList = () => {
    const {
        // Data
        filteredCustomers,
        loading,
        error,
        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        // Search, Filter, Sort
        searchTerm,
        setSearchTerm,
        sortConfig,
        setSortConfig,
        // Actions
        fetchCustomers,
        // Utilities
        clearFilters,
        getStatistics
    } = useCustomerList();

    // Handler functions
    const handleSearchChange = (value) => {
        setSearchTerm(value);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchCustomers}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Quản lý khách hàng
                    </h1>
                    <p className="text-gray-600">
                        Quản lý danh sách khách hàng và thông tin
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Tổng khách hàng</h3>
                        <p className="text-2xl font-bold text-gray-900">{statistics.totalCustomers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Kết quả lọc</h3>
                        <p className="text-2xl font-bold text-blue-600">{statistics.filteredCount}</p>
                    </div>
                </div>

                {/* Search and filters */}
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <CustomerSearch
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        filteredCustomersCount={statistics.filteredCount}
                    />

                    <CustomerSort
                        sortConfig={sortConfig}
                        onSort={handleSort}
                    />

                    {(searchTerm) && (
                        <div className="mt-4">
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>

                {/* Customer table */}
                <CustomerTable
                    customers={filteredCustomers}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    loading={loading}
                />
            </div>
        </div>
    )
        ;
};

export default CustomerList;
