// src/pages/Staff/Order/OrderManagement.jsx
import React from 'react';
import OrderSearch from './OrderSearch';
import OrderFilter from './OrderFilter';
import OrderSort from './OrderSort';
import OrderTable from './OrderTable.jsx';
import { useOrderManagement } from '../../../hooks/useOrderManagement';

const OrderManagement = () => {
    const {
        // Data
        filteredOrders,
        loading,
        error,
        authError,

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
        updateOrderStatus,
        deleteOrder,

        // Utilities
        clearFilters,
        getStatistics
    } = useOrderManagement();

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

    const stats = getStatistics();

    // Authentication error handling
    if (authError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Phiên đăng nhập đã hết hạn
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống quản lý đơn hàng.
                        </p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Đăng nhập lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Error handling
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <div className="text-sm">
                                    <strong className="font-medium">Lỗi khi tải dữ liệu:</strong>
                                    <p className="mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Tải lại trang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-gray-600">
                        Quản lý các đơn hàng và trạng thái giao hàng trong hệ thống
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100">
                                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Tổng đơn hàng</h3>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-100">
                                    <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Đang xử lý</h3>
                                <p className="text-2xl font-bold text-yellow-600">{stats.processingOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Đang giao</h3>
                                <p className="text-2xl font-bold text-blue-600">{stats.shippingOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100">
                                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Đã giao</h3>
                                <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-100">
                                    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Đã hủy</h3>
                                <p className="text-2xl font-bold text-red-600">{stats.canceledOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    {/* Search Bar */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Tìm kiếm</h3>
                            <div className="text-sm text-gray-500">
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                        Đang tải...
                                    </div>
                                ) : (
                                    `${filteredOrders.length} đơn hàng`
                                )}
                            </div>
                        </div>
                        <OrderSearch
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            filteredOrdersCount={filteredOrders.length}
                        />
                    </div>

                    {/* Filter Options */}
                    <div className="p-6 border-b border-gray-200">
                        <OrderFilter
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                        />
                    </div>

                    {/* Sort Options */}
                    <div className="p-6">
                        <OrderSort
                            sortConfig={sortConfig}
                            onSort={handleSort}
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <OrderTable
                    orders={filteredOrders}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onUpdateOrderStatus={updateOrderStatus}
                    onDeleteOrder={deleteOrder}
                    loading={loading}
                />

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-gray-700 font-medium">Đang xử lý...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;
