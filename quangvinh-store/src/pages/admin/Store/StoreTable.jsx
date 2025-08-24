import React, { useState } from 'react';
import { Edit, Plus, Eye } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import DataTable from '../../../components/common/admin/DataTable';
import Paginations from '../../../components/common/admin/Paginations';
import MapSelector from '../Store/MapSelector';
import { STORE_HELPERS, STORE_DEFAULTS } from '../../../utils/constants/StoreConstants';

const StoreTable = ({
                        storeList,
                        currentPage,
                        setCurrentPage,
                        itemsPerPage,
                        onCreateStore,
                        onUpdateStore,
                        onDeleteStore,
                        onGetStoreDetails,
                        loading
                    }) => {
    // Modal states
    const { showSuccess, showError } = useToast();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [storeDetails, setStoreDetails] = useState(null);

    // Form states
    const [newStore, setNewStore] = useState(STORE_DEFAULTS.NEW_STORE);
    const [updateStoreData, setUpdateStoreData] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);

    // Modal handlers
    const openCreateModal = () => {
        console.log('Opening create modal');
        setNewStore(STORE_DEFAULTS.NEW_STORE);
        setSelectedPosition(null);
        setShowCreateModal(true);
        console.log('showCreateModal set to:', true);
    };

    const openUpdateModal = async (store) => {
        console.log('Opening update modal for store:', store.storeId);
        const details = await onGetStoreDetails(store.storeId);
        if (details.success) {
            const data = details.data;
            setUpdateStoreData({
                storeId: data.storeId,
                storeName: data.storeName,
                storeAddress: data.storeAddress,
                storePhone: data.storePhone,
                city: data.city,
                district: data.district,
                startWorkingAt: STORE_HELPERS.formatTime(data.startWorkingAt),
                endWorkingAt: STORE_HELPERS.formatTime(data.endWorkingAt),
                locationLat: data.locationLat,
                locationLng: data.locationLng
            });

            if (data.locationLat && data.locationLng) {
                setSelectedPosition({
                    lat: parseFloat(data.locationLat),
                    lng: parseFloat(data.locationLng)
                });
            }

            setSelectedStore(store);
            setShowUpdateModal(true);
            console.log('showUpdateModal set to:', true);
        }
    };

    const openDetailModal = async (store) => {
        console.log('Opening detail modal for store:', store.storeId);
        const details = await onGetStoreDetails(store.storeId);
        if (details.success) {
            setStoreDetails(details.data);
            setSelectedStore(store);
            setShowDetailModal(true);
            console.log('showDetailModal set to:', true);
        }
    };

    const openStatusModal = (store) => {
        setSelectedStore(store);
        setShowStatusModal(true);
    };

    // CRUD operations
    const handleCreateStore = async () => {
        const validation = STORE_HELPERS.validateStoreData(newStore);
        if (!validation.isValid) {
            showError(validation.errors.join('\n'));
            return;
        }

        const result = await onCreateStore(newStore);
        if (result.success) {
            setShowCreateModal(false);
            setNewStore(STORE_DEFAULTS.NEW_STORE);
            setSelectedPosition(null);
            showSuccess('Tạo cửa hàng thành công!');
        } else {
            showError(`Lỗi: ${result.error}`);
        }
    };

    const handleUpdateStore = async () => {
        const validation = STORE_HELPERS.validateStoreData(updateStoreData);
        if (!validation.isValid) {
            showError(validation.errors.join('\n'));
            return;
        }

        const result = await onUpdateStore(updateStoreData.storeId, updateStoreData);
        if (result.success) {
            setShowUpdateModal(false);
            setUpdateStoreData(null);
            setSelectedPosition(null);
            showSuccess('Cập nhật cửa hàng thành công!');
        } else {
            showError(`Lỗi: ${result.error}`);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedStore) return;

        const result = await onDeleteStore(selectedStore.storeId);
        if (result.success) {
            setShowStatusModal(false);
            setSelectedStore(null);
            showSuccess('Thay đổi trạng thái thành công!');
        } else {
            showError(`Lỗi: ${result.error}`);
        }
    };

    const handlePositionChange = (latlng, isUpdate = false) => {
        setSelectedPosition(latlng);
        if (isUpdate) {
            setUpdateStoreData(prev => ({
                ...prev,
                locationLat: latlng.lat.toString(),
                locationLng: latlng.lng.toString()
            }));
        } else {
            setNewStore(prev => ({
                ...prev,
                locationLat: latlng.lat.toString(),
                locationLng: latlng.lng.toString()
            }));
        }
    };

    // Time input component
    const TimeInput = ({ value, onChange, placeholder }) => (
        <input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    );

    // Create store form
    const createStoreForm = (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên cửa hàng</label>
                <input
                    type="text"
                    value={newStore.storeName}
                    onChange={(e) => setNewStore(prev => ({ ...prev, storeName: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên cửa hàng"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                    type="text"
                    value={newStore.storePhone}
                    onChange={(e) => setNewStore(prev => ({ ...prev, storePhone: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ cửa hàng</label>
                <input
                    type="text"
                    value={newStore.storeAddress}
                    onChange={(e) => setNewStore(prev => ({ ...prev, storeAddress: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ cửa hàng"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                    <input
                        type="text"
                        value={newStore.city}
                        onChange={(e) => setNewStore(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập thành phố"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Quận</label>
                    <input
                        type="text"
                        value={newStore.district}
                        onChange={(e) => setNewStore(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập phường/quận"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ mở cửa</label>
                    <TimeInput
                        value={newStore.startWorkingAt}
                        onChange={(value) => setNewStore(prev => ({ ...prev, startWorkingAt: value }))}
                        placeholder="07:00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ đóng cửa</label>
                    <TimeInput
                        value={newStore.endWorkingAt}
                        onChange={(value) => setNewStore(prev => ({ ...prev, endWorkingAt: value }))}
                        placeholder="22:00"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn vị trí trên bản đồ</label>
                <MapSelector
                    selectedPosition={selectedPosition}
                    onPositionChange={(latlng) => handlePositionChange(latlng, false)}
                    height="400px"
                />
            </div>
        </div>
    );

    // Update store form
    const updateStoreForm = updateStoreData && (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên cửa hàng</label>
                <input
                    type="text"
                    value={updateStoreData.storeName}
                    onChange={(e) => setUpdateStoreData(prev => ({ ...prev, storeName: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên cửa hàng"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                    type="text"
                    value={updateStoreData.storePhone}
                    onChange={(e) => setUpdateStoreData(prev => ({ ...prev, storePhone: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ cửa hàng</label>
                <input
                    type="text"
                    value={updateStoreData.storeAddress}
                    onChange={(e) => setUpdateStoreData(prev => ({ ...prev, storeAddress: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ cửa hàng"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                    <input
                        type="text"
                        value={updateStoreData.city}
                        onChange={(e) => setUpdateStoreData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập thành phố"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Quận</label>
                    <input
                        type="text"
                        value={updateStoreData.district}
                        onChange={(e) => setUpdateStoreData(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập phường/quận"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ mở cửa</label>
                    <TimeInput
                        value={updateStoreData.startWorkingAt}
                        onChange={(value) => setUpdateStoreData(prev => ({ ...prev, startWorkingAt: value }))}
                        placeholder="07:00"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ đóng cửa</label>
                    <TimeInput
                        value={updateStoreData.endWorkingAt}
                        onChange={(value) => setUpdateStoreData(prev => ({ ...prev, endWorkingAt: value }))}
                        placeholder="22:00"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn vị trí trên bản đồ</label>
                <MapSelector
                    selectedPosition={selectedPosition}
                    onPositionChange={(latlng) => handlePositionChange(latlng, true)}
                    height="400px"
                />
            </div>
        </div>
    );

    // store detail modal content
    const storeDetailContent = storeDetails && (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại:</label>
                    <p className="text-gray-900">{storeDetails.storePhone || 'Chưa cập nhật'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ:</label>
                    <p className="text-gray-900">{storeDetails.storeAddress || 'Chưa cập nhật'}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thành phố:</label>
                    <p className="text-gray-900">{storeDetails.city || 'Chưa cập nhật'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phường/Quận:</label>
                    <p className="text-gray-900">{storeDetails.district || 'Chưa cập nhật'}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giờ mở cửa:</label>
                    <p className="text-gray-900">{STORE_HELPERS.formatTime(storeDetails.startWorkingAt) || 'Chưa cập nhật'}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giờ đóng cửa:</label>
                    <p className="text-gray-900">{STORE_HELPERS.formatTime(storeDetails.endWorkingAt) || 'Chưa cập nhật'}</p>
                </div>
            </div>

            {storeDetails.locationLat && storeDetails.locationLng && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí cửa hàng:</label>
                    <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                        <p className="text-sm text-gray-600 mb-2">
                            <strong>Tọa độ:</strong><br />
                            Vĩ độ: {parseFloat(storeDetails.locationLat).toFixed(6)}<br />
                            Kinh độ: {parseFloat(storeDetails.locationLng).toFixed(6)}
                        </p>
                        <a
                            href={`https://www.google.com/maps?q=${storeDetails.locationLat},${storeDetails.locationLng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                        >
                            Xem trên Google Maps
                        </a>
                    </div>
                </div>
            )}
        </div>
    );

    // Table columns configuration - CẬP NHẬT BUTTON TRẠNG THÁI
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (store, index) => (
                <span className="text-sm text-gray-900">
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
            key: 'storePhone',
            header: 'Số điện thoại',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (store) => (
                <span className="text-sm text-gray-900">
          {store.storePhone || 'Chưa cập nhật'}
        </span>
            )
        },
        {
            key: 'storeAddress',
            header: 'Địa chỉ cửa hàng',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (store) => (
                <span className="text-sm text-gray-900">
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
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors hover:opacity-80 ${STORE_HELPERS.getStatusColorClass(store.isActive)}`}
                    title={store.isActive ? "Click để ngừng hoạt động" : "Click để kích hoạt"}
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
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => openDetailModal(store)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => openUpdateModal(store)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Danh sách cửa hàng</h3>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus size={16} className="mr-2" />
                    Thêm cửa hàng
                </button>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={storeList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                loading={loading}
                emptyMessage="Không có cửa hàng nào"
            />

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
                <Paginations
                    currentPage={currentPage}
                    totalPages={Math.ceil(storeList.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    totalItems={storeList.length}
                    itemsPerPage={itemsPerPage}
                />
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '900px',
                        width: '95%',
                        maxHeight: '95%',
                        overflow: 'auto'
                    }}>
                        <h2 className="text-xl font-bold mb-4">Thêm cửa hàng mới</h2>
                        {createStoreForm}
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleCreateStore}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Tạo
                            </button>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '900px',
                        width: '95%',
                        maxHeight: '95%',
                        overflow: 'auto'
                    }}>
                        <h2 className="text-xl font-bold mb-4">Cập nhật thông tin cửa hàng</h2>
                        {updateStoreForm}
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleUpdateStore}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Cập nhật
                            </button>
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '800px',
                        width: '90%',
                        maxHeight: '90%',
                        overflow: 'auto'
                    }}>
                        <h2 className="text-xl font-bold mb-4">
                            Thông tin chi tiết cửa hàng {selectedStore?.storeName || ''}
                        </h2>
                        {storeDetailContent}
                        <div style={{ marginTop: '20px' }}>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Modal - CẬP NHẬT NỘI DUNG */}
            {showStatusModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <h2 className="text-xl font-bold mb-4">Xác nhận thay đổi trạng thái</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            {selectedStore?.isActive
                                ? `Bạn muốn ngừng hoạt động cửa hàng "${selectedStore?.storeName}" không?`
                                : `Bạn muốn kích hoạt lại cửa hàng "${selectedStore?.storeName}" không?`
                            }
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleStatusChange}
                                className={`px-4 py-2 text-white rounded-md hover:opacity-90 ${
                                    selectedStore?.isActive
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {selectedStore?.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreTable;
