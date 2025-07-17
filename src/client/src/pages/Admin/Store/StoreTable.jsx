// src/pages/Admin/Store/StoreTable.jsx
import React, { useState } from 'react';
import { Edit, Plus } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modals from '../../../components/common/Admin/Modals';
import Paginations from '../../../components/common/Admin/Paginations';
import { STORE_HELPERS, STORE_DEFAULTS } from '../../../utils/constants/StoreConstants';

const StoreTable = ({
                        storeList,
                        currentPage,
                        setCurrentPage,
                        itemsPerPage,
                        onCreateStore,
                        onUpdateStore,
                        onDeleteStore,
                        loading
                    }) => {
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    // Form states
    const [newStore, setNewStore] = useState(STORE_DEFAULTS.NEW_STORE);
    const [updateStoreData, setUpdateStoreData] = useState(null);

    // Modal handlers
    const openCreateModal = () => {
        setNewStore(STORE_DEFAULTS.NEW_STORE);
        setShowCreateModal(true);
    };

    const openUpdateModal = (store) => {
        setUpdateStoreData({
            storeId: store.storeId,
            storeName: store.storeName,
            storeAddress: store.storeAddress
        });
        setSelectedStore(store);
        setShowUpdateModal(true);
    };

    const openStatusModal = (store) => {
        setSelectedStore(store);
        setShowStatusModal(true);
    };

    // CRUD operations
    const handleCreateStore = async () => {
        const validation = STORE_HELPERS.validateStoreData(newStore);
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return;
        }
        const result = await onCreateStore(newStore);
        if (result.success) {
            setShowCreateModal(false);
            setNewStore(STORE_DEFAULTS.NEW_STORE);
            alert('Tạo cửa hàng thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleUpdateStore = async () => {
        const validation = STORE_HELPERS.validateStoreData(updateStoreData);
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return;
        }
        const result = await onUpdateStore(updateStoreData.storeId, updateStoreData);
        if (result.success) {
            setShowUpdateModal(false);
            setUpdateStoreData(null);
            alert('Cập nhật cửa hàng thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedStore) return;
        const result = await onDeleteStore(selectedStore.storeId);
        if (result.success) {
            setShowStatusModal(false);
            setSelectedStore(null);
            alert('Thay đổi trạng thái thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    // Table columns configuration
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (store, index) => (
                <span className="text-sm font-medium text-gray-900">
          {(Number(currentPage) - 1) * Number(itemsPerPage) + index + 1}
        </span>
            )
        },
        {
            key: 'storeId',
            header: 'ID',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (store) => (
                <span className="text-sm font-medium text-gray-900">
          {store.storeId}
        </span>
            )
        },
        {
            key: 'storeName',
            header: 'Tên cửa hàng',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (store) => (
                <span className="text-sm font-medium text-gray-900">
          {store.storeName}
        </span>
            )
        },
        {
            key: 'storeAddress',
            header: 'Địa chỉ cửa hàng',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (store) => (
                <span className="text-sm text-gray-700">
          {store.storeAddress}
        </span>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (store) => (
                <button
                    onClick={() => openStatusModal(store)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        store.isActive
                            ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                    }`}
                >
                    {STORE_HELPERS.getStatusText(store.isActive)}
                </button>
            )
        },
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (store) => (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => openUpdateModal(store)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Pagination
    const totalPages = Math.ceil(storeList.length / itemsPerPage);
    const paginatedData = storeList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                    Tìm thấy {storeList.length} cửa hàng
                </h2>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo cửa hàng
                </button>
            </div>

            {/* Data Table */}
            <div className="px-6">
                <DataTable
                    data={paginatedData}
                    columns={columns}
                    loading={loading}
                    emptyMessage="Không có cửa hàng nào"
                />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 pb-6">
                    <Paginations
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Create Modal */}
            <Modals
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Tạo cửa hàng mới"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên cửa hàng *
                        </label>
                        <input
                            type="text"
                            value={newStore.storeName}
                            onChange={(e) => setNewStore(prev => ({ ...prev, storeName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tên cửa hàng"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ cửa hàng *
                        </label>
                        <input
                            type="text"
                            value={newStore.storeAddress}
                            onChange={(e) => setNewStore(prev => ({ ...prev, storeAddress: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập địa chỉ cửa hàng"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleCreateStore}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Tạo
                    </button>
                </div>
            </Modals>

            {/* Update Modal */}
            <Modals
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật cửa hàng"
                size="md"
            >
                {updateStoreData && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên cửa hàng *
                            </label>
                            <input
                                type="text"
                                value={updateStoreData.storeName}
                                onChange={(e) => setUpdateStoreData(prev => ({ ...prev, storeName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tên cửa hàng"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Địa chỉ cửa hàng *
                            </label>
                            <input
                                type="text"
                                value={updateStoreData.storeAddress}
                                onChange={(e) => setUpdateStoreData(prev => ({ ...prev, storeAddress: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập địa chỉ cửa hàng"
                            />
                        </div>
                    </div>
                )}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={() => setShowUpdateModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleUpdateStore}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Cập nhật
                    </button>
                </div>
            </Modals>

            {/* Status Change Confirmation Modal */}
            <Modals
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Xác nhận thay đổi trạng thái"
                size="sm"
            >
                {selectedStore && (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedStore.isActive
                                ? `Bạn muốn ngừng hoạt động cửa hàng "${selectedStore.storeName}" không?`
                                : `Bạn muốn kích hoạt lại cửa hàng "${selectedStore.storeName}" không?`
                            }
                        </p>
                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleStatusChange}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                )}
            </Modals>
        </div>
    );
};

export default StoreTable;
