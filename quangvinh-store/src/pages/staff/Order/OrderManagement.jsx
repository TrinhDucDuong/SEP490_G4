import React, { useState } from 'react';
import OrderSearch from './OrderSearch';
import OrderFilter from './OrderFilter';
import OrderSort from './OrderSort';
import OrderTable from './OrderTable.jsx';
import OrderModal from './OrderModal.jsx';
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
        // Utilities
        clearFilters,
        getStatistics
    } = useOrderManagement();

    // MODAL STATES
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    // MODAL HANDLERS
    const handleViewOrder = (order) => {
        console.log('Opening detail modal for order:', order);
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handleEditOrder = (order) => {
        console.log('Opening update modal for order:', order);
        setSelectedOrder(order);
        setShowUpdateModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedOrder(null);
    };

    const stats = getStatistics();

    // Authentication error handling
    if (authError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Phiên đăng nhập đã hết hạn</h2>
                    <p className="text-gray-600 mb-4">
                        Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống quản lý đơn hàng.
                    </p>
                    <button
                        onClick={() => window.location.href = '/admin/login'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Đăng nhập lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
                <p className="text-gray-600">Quản lý các đơn hàng và trạng thái giao hàng trong hệ thống</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Tổng đơn hàng</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Đang xử lý</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.processingOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Đang giao</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.shippingOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500">Đã giao</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Search */}
            <OrderSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filteredOrdersCount={stats.filteredCount}
            />

            {/* Filter */}
            <OrderFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />

            {/* Sort */}
            <OrderSort
                sortConfig={sortConfig}
                onSort={handleSort}
            />

            {/* Table */}
            <OrderTable
                orders={filteredOrders}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                loading={loading}
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder}
            />

            {/* RENDER MODAL COMPONENTS */}
            <OrderModal
                showDetailModal={showDetailModal}
                showUpdateModal={showUpdateModal}
                selectedOrder={selectedOrder}
                onCloseDetailModal={handleCloseDetailModal}
                onCloseUpdateModal={handleCloseUpdateModal}
                onUpdateOrderStatus={updateOrderStatus}
            />
        </div>
    );
};

export default OrderManagement;
