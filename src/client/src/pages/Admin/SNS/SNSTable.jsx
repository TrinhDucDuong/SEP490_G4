// src/pages/Admin/SNS/SNSTable.jsx
import React, { useState } from 'react';
import { Edit, Plus, ExternalLink } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable.jsx';
import Modals from '../../../components/common/Admin/Modals.jsx';
import Paginations from '../../../components/common/Admin/Paginations.jsx';
import { SNS_HELPERS, SNS_DEFAULTS } from '../../../utils/constants/SNSConstants.js';

const SNSTable = ({
                      snsList,
                      currentPage,
                      setCurrentPage,
                      itemsPerPage,
                      onCreateSNS,
                      onUpdateSNS,
                      onDeleteSNS,
                      loading
                  }) => {
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedSNS, setSelectedSNS] = useState(null);

    // Form states
    const [newSNS, setNewSNS] = useState(SNS_DEFAULTS.NEW_SNS);
    const [updateSNSData, setUpdateSNSData] = useState(null);

    // Modal handlers
    const openCreateModal = () => {
        setNewSNS(SNS_DEFAULTS.NEW_SNS);
        setShowCreateModal(true);
    };

    const openUpdateModal = (sns) => {
        setUpdateSNSData({
            snsId: sns.snsId,
            snsName: sns.snsName,
            snsUrl: sns.snsUrl,
            snsChatUrl: sns.snsChatUrl
        });
        setSelectedSNS(sns);
        setShowUpdateModal(true);
    };

    const openStatusModal = (sns) => {
        setSelectedSNS(sns);
        setShowStatusModal(true);
    };

    // CRUD operations
    const handleCreateSNS = async () => {
        const validation = SNS_HELPERS.validateSNSData(newSNS);
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return;
        }

        const result = await onCreateSNS(newSNS);
        if (result.success) {
            setShowCreateModal(false);
            setNewSNS(SNS_DEFAULTS.NEW_SNS);
            alert('Tạo mạng xã hội thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleUpdateSNS = async () => {
        const validation = SNS_HELPERS.validateSNSData(updateSNSData);
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return;
        }

        const result = await onUpdateSNS(updateSNSData.snsId, updateSNSData);
        if (result.success) {
            setShowUpdateModal(false);
            setUpdateSNSData(null);
            alert('Cập nhật mạng xã hội thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedSNS) return;

        const result = await onDeleteSNS(selectedSNS.snsId);
        if (result.success) {
            setShowStatusModal(false);
            setSelectedSNS(null);
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
            render: (sns, index) => (
                <span className="text-sm font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
            )
        },
        {
            key: 'snsId',
            header: 'ID',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (sns) => (
                <span className="text-sm font-medium text-gray-900">
                    {sns.snsId}
                </span>
            )
        },
        {
            key: 'snsName',
            header: 'Tên mạng xã hội',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (sns) => (
                <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                        {sns.snsName}
                    </span>
                </div>
            )
        },
        {
            key: 'snsUrl',
            header: 'Đường dẫn đến trang',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (sns) => (
                <div className="flex items-center">
                    <a
                        href={sns.snsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <span className="truncate max-w-xs">{sns.snsUrl}</span>
                        <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                    </a>
                </div>
            )
        },
        {
            key: 'snsChatUrl',
            header: 'Đường dẫn đến hộp thư',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (sns) => (
                <div className="flex items-center">
                    <a
                        href={sns.snsChatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <span className="truncate max-w-xs">{sns.snsChatUrl}</span>
                        <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                    </a>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (sns) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SNS_HELPERS.getStatusColorClass(sns.isActive)}`}>
                    {SNS_HELPERS.getStatusText(sns.isActive)}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (sns) => (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={() => openUpdateModal(sns)}
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
    const totalPages = Math.ceil(snsList.length / itemsPerPage);
    const paginatedData = snsList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                    Tìm thấy {snsList.length} mạng xã hội
                </h2>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo mạng xã hội
                </button>
            </div>

            {/* Data Table */}
            <div className="px-6">
                <DataTable
                    data={paginatedData}
                    columns={columns}
                    loading={loading}
                    emptyMessage="Không có mạng xã hội nào"
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
                title="Tạo mạng xã hội mới"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên mạng xã hội *
                        </label>
                        <input
                            type="text"
                            value={newSNS.snsName}
                            onChange={(e) => setNewSNS(prev => ({ ...prev, snsName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tên mạng xã hội"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đường dẫn đến trang *
                        </label>
                        <input
                            type="url"
                            value={newSNS.snsUrl}
                            onChange={(e) => setNewSNS(prev => ({ ...prev, snsUrl: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đường dẫn đến hộp thư *
                        </label>
                        <input
                            type="url"
                            value={newSNS.snsChatUrl}
                            onChange={(e) => setNewSNS(prev => ({ ...prev, snsChatUrl: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/username/chat"
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
                        onClick={handleCreateSNS}
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
                title="Cập nhật mạng xã hội"
                size="md"
            >
                {updateSNSData && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên mạng xã hội *
                            </label>
                            <input
                                type="text"
                                value={updateSNSData.snsName}
                                onChange={(e) => setUpdateSNSData(prev => ({ ...prev, snsName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tên mạng xã hội"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đường dẫn đến trang *
                            </label>
                            <input
                                type="url"
                                value={updateSNSData.snsUrl}
                                onChange={(e) => setUpdateSNSData(prev => ({ ...prev, snsUrl: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đường dẫn đến hộp thư *
                            </label>
                            <input
                                type="url"
                                value={updateSNSData.snsChatUrl}
                                onChange={(e) => setUpdateSNSData(prev => ({ ...prev, snsChatUrl: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/username/chat"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => openStatusModal(selectedSNS)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        selectedSNS?.isActive
                                            ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
                                            : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200'
                                    }`}
                                >
                                    {selectedSNS?.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                </button>
                            </div>
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
                        onClick={handleUpdateSNS}
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
                {selectedSNS && (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedSNS.isActive
                                ? `Bạn muốn ngừng hoạt động mạng xã hội "${selectedSNS.snsName}" không?`
                                : `Bạn muốn kích hoạt lại mạng xã hội "${selectedSNS.snsName}" không?`
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

export default SNSTable;
