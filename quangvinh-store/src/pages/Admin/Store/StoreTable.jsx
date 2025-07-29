// src/pages/Admin/Store/StoreTable.jsx
import React, { useState } from 'react';
import { Edit, Plus, Eye } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import DataTable from '../../../components/common/Admin/DataTable';
import Modals from '../../../components/common/Admin/Modals';
import Paginations from '../../../components/common/Admin/Paginations';
import { STORE_HELPERS, STORE_DEFAULTS } from '../../../utils/constants/StoreConstants';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

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

    // Map click handler component
    const MapClickHandler = ({ onMapClick }) => {
        useMapEvents({
            click(e) {
                onMapClick(e.latlng);
            },
        });
        return null;
    };

    // Modal handlers
    const openCreateModal = () => {
        setNewStore(STORE_DEFAULTS.NEW_STORE);
        setSelectedPosition(null);
        setShowCreateModal(true);
    };

    const openUpdateModal = async (store) => {
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
        }
    };

    const openStatusModal = (store) => {
        setSelectedStore(store);
        setShowStatusModal(true);
    };

    const openDetailModal = async (store) => {
        const details = await onGetStoreDetails(store.storeId);
        if (details.success) {
            setStoreDetails(details.data);
            setSelectedStore(store);
            setShowDetailModal(true);
        }
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
            setSelectedPosition(null);
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
            setSelectedPosition(null);
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

    const handleMapClick = (latlng, isUpdate = false) => {
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

    // Default map center (Hanoi)
    const DEFAULT_MAP_CENTER = [21.028511, 105.804817];

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
                <div className="h-64 border border-gray-300 rounded-md">
                    <MapContainer
                        center={DEFAULT_MAP_CENTER}
                        zoom={13}
                        className="w-full h-full"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapClickHandler onMapClick={(latlng) => handleMapClick(latlng, false)} />
                        {selectedPosition && (
                            <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
                                <Popup>Vị trí đã chọn</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
                {selectedPosition && (
                    <p className="text-sm text-gray-600 mt-2">
                        Vị trí: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                    </p>
                )}
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
                <div className="h-64 border border-gray-300 rounded-md">
                    <MapContainer
                        center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : DEFAULT_MAP_CENTER}
                        zoom={13}
                        className="w-full h-full"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapClickHandler onMapClick={(latlng) => handleMapClick(latlng, true)} />
                        {selectedPosition && (
                            <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
                                <Popup>Vị trí đã chọn</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
                {selectedPosition && (
                    <p className="text-sm text-gray-600 mt-2">
                        Vị trí: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                    </p>
                )}
            </div>
        </div>
    );

    // Store detail modal content
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
                    <div className="h-64 border border-gray-300 rounded-md">
                        <MapContainer
                            center={[parseFloat(storeDetails.locationLat), parseFloat(storeDetails.locationLng)]}
                            zoom={15}
                            className="w-full h-full"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[parseFloat(storeDetails.locationLat), parseFloat(storeDetails.locationLng)]}>
                                <Popup>{storeDetails.storeName}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Tọa độ: {parseFloat(storeDetails.locationLat).toFixed(6)}, {parseFloat(storeDetails.locationLng).toFixed(6)}
                    </p>
                </div>
            )}
        </div>
    );

    // Table columns configuration
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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STORE_HELPERS.getStatusColorClass(store.isActive)}`}>
          {STORE_HELPERS.getStatusText(store.isActive)}
        </span>
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
                    <button
                        onClick={() => openStatusModal(store)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            store.isActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                        {store.isActive ? 'Ngừng HĐ' : 'Kích hoạt'}
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

            {/* Modals */}
            <Modals
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onConfirm={handleCreateStore}
                title="Thêm cửa hàng mới"
                confirmText="Tạo"
                cancelText="Hủy"
                size="large"
            >
                {createStoreForm}
            </Modals>

            <Modals
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onConfirm={handleUpdateStore}
                title="Cập nhật thông tin cửa hàng"
                confirmText="Cập nhật"
                cancelText="Hủy"
                size="large"
            >
                {updateStoreForm}
            </Modals>

            <Modals
                show={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={`Thông tin chi tiết cửa hàng ${selectedStore?.storeName || ''}`}
                confirmText="Đóng"
                showCancel={false}
                size="large"
            >
                {storeDetailContent}
            </Modals>

            <Modals
                show={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                onConfirm={handleStatusChange}
                title="Xác nhận thay đổi trạng thái"
                confirmText="Xác nhận"
                cancelText="Hủy"
                type="warning"
            >
                <p className="text-sm text-gray-600">
                    {selectedStore?.isActive
                        ? `Bạn muốn ngừng hoạt động cửa hàng "${selectedStore?.storeName}" không?`
                        : `Bạn muốn kích hoạt lại cửa hàng "${selectedStore?.storeName}" không?`
                    }
                </p>
            </Modals>
        </div>
    );
};

export default StoreTable;
