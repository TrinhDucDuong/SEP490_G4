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
        getStoreDetails,
        createStore,
        updateStore,
        deleteStore,
        clearFilters,
        getStatistics
    } = useStoreManagement();

    const handleSearchChange = (value) => setSearchTerm(value);
    const handleFilterChange = (key, value) =>
        setFilters(prev => ({ ...prev, [key]: value }));
    const handleSort = (key) =>
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    const handleClearFilters = () => clearFilters();

    const statistics = getStatistics();

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
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
            {/* Header */}
            <div>
                <div className="mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý cửa hàng</h1>
                        <p className="text-gray-600 mt-1">
                            Quản lý các cửa hàng của hệ thống
                        </p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{statistics.totalStores}</div>
                        <div className="text-sm text-blue-600">Tổng cửa hàng</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{statistics.activeStores}</div>
                        <div className="text-sm text-green-600">Đang hoạt động</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{statistics.inactiveStores}</div>
                        <div className="text-sm text-red-600">Ngừng hoạt động</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">{statistics.filteredCount}</div>
                        <div className="text-sm text-gray-600">Kết quả lọc</div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <StoreSearch
                            searchTerm={searchTerm}
                            onSearchChange={handleSearchChange}
                            filteredStoresCount={statistics.filteredCount}
                        />
                    </div>
                    <div className="flex gap-4">
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

            {/* Table */}
            <StoreTable
                storeList={filteredStores}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onCreateStore={createStore}
                onUpdateStore={updateStore}
                onDeleteStore={deleteStore}
                onGetStoreDetails={getStoreDetails}
                loading={loading}
            />
        </div>
    );
};

export default StoreManagement;
