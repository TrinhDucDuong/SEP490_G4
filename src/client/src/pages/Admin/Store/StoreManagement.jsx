import React from 'react';
import StoreSearch from './StoreSearch';
import StoreFilter from './StoreFilter';
import StoreSort from './StoreSort';
import StoreTable from './StoreTable.jsx';
import { useStoreManagement } from '../../../hooks/Admin/useStoreManagement';

const StoreManagement = () => {
    const {
        filteredStores,
        loading,
        error,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,
        createStore,
        updateStore,
        deleteStore,
        clearFilters,
        getStatistics
    } = useStoreManagement();

    const handleSearchChange = (value) => setSearchTerm(value);
    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
    const handleSort = (key) => setSortConfig(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    const handleClearFilters = () => clearFilters();
    const statistics = getStatistics();

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
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
            </div>
        );
    }

    return (
        <div>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý cửa hàng</h1>
                    <p className="mt-2 text-gray-600">Quản lý các cửa hàng của hệ thống</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng cửa hàng</dt>
                                    <dd className="text-lg font-medium text-gray-900">{statistics.totalStores}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Đang hoạt động</dt>
                                    <dd className="text-lg font-medium text-gray-900">{statistics.activeStores}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Ngừng hoạt động</dt>
                                    <dd className="text-lg font-medium text-gray-900">{statistics.inactiveStores}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Kết quả lọc</dt>
                                    <dd className="text-lg font-medium text-gray-900">{statistics.filteredCount}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6 border-b border-gray-200">
                        <StoreSearch
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            filteredStoresCount={statistics.filteredCount}
                        />
                    </div>
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-wrap items-center gap-4">
                            <StoreFilter
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                            />
                            <StoreSort
                                sortConfig={sortConfig}
                                onSort={handleSort}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow">
                    <StoreTable
                        storeList={filteredStores}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        onCreateStore={createStore}
                        onUpdateStore={updateStore}
                        onDeleteStore={deleteStore}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default StoreManagement;
