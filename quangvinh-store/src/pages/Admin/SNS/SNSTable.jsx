// src/pages/Admin/SNS/SNSTable.jsx
import React, { useState } from 'react';
import { Edit, Plus, Trash2, ExternalLink } from 'lucide-react'; // Thêm ExternalLink import
import DataTable from '../../../components/common/Admin/DataTable';
import SNSModal from './SNSModal'; // Sửa đường dẫn import
import Paginations from '../../../components/common/Admin/Paginations';
import { SNS_HELPERS, SNS_DEFAULTS } from '../../../utils/constants/SNSConstants';

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSNS, setSelectedSNS] = useState(null);

    // Form states
    const [newSNS, setNewSNS] = useState(SNS_DEFAULTS.NEW_SNS);
    const [updateSNSData, setUpdateSNSData] = useState(null);

    // Modal handlers
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

    const openDeleteModal = (sns) => {
        setSelectedSNS(sns);
        setShowDeleteModal(true);
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

    const handleDeleteSNS = async () => {
        if (!selectedSNS) return;

        const result = await onDeleteSNS(selectedSNS.snsId);
        if (result.success) {
            setShowDeleteModal(false);
            setSelectedSNS(null);
            alert('Xóa mạng xã hội thành công!');
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
                    <button
                        onClick={() => openDeleteModal(sns)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Pagination
    const totalPages = Math.ceil(snsList.length / itemsPerPage);
    const currentSNS = snsList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-4">
            {/* Header với nút thêm mới */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                    Danh sách mạng xã hội ({snsList.length})
                </h3>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus size={16} className="mr-2" />
                    Thêm mạng xã hội
                </button>
            </div>

            {/* Data Table */}
            <DataTable
                data={currentSNS}
                columns={columns}
                loading={loading}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Create Modal */}
            <SNSModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm mạng xã hội mới"
                onConfirm={handleCreateSNS}
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên mạng xã hội <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={newSNS.snsName}
                            onChange={(e) => setNewSNS(prev => ({ ...prev, snsName: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ví dụ: Facebook, Instagram, TikTok..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đường dẫn trang <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            value={newSNS.snsUrl}
                            onChange={(e) => setNewSNS(prev => ({ ...prev, snsUrl: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://facebook.com/yourpage"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đường dẫn chat
                        </label>
                        <input
                            type="url"
                            value={newSNS.snsChatUrl}
                            onChange={(e) => setNewSNS(prev => ({ ...prev, snsChatUrl: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://m.me/yourpage"
                        />
                    </div>
                </div>
            </SNSModal>

            {/* Update Modal */}
            <SNSModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật mạng xã hội"
                onConfirm={handleUpdateSNS}
                size="md"
            >
                {updateSNSData && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên mạng xã hội <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={updateSNSData.snsName}
                                onChange={(e) => setUpdateSNSData(prev => ({ ...prev, snsName: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đường dẫn trang <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={updateSNSData.snsUrl}
                                onChange={(e) => setUpdateSNSData(prev => ({ ...prev, snsUrl: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đường dẫn chat
                            </label>
                            <input
                                type="url"
                                value={updateSNSData.snsChatUrl}
                                onChange={(e) => setUpdateSNSData(prev => ({ ...prev, snsChatUrl: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}
            </SNSModal>

            {/* Delete Modal */}
            <SNSModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
                onConfirm={handleDeleteSNS}
                confirmText="Xóa"
                cancelText="Hủy"
                danger
                size="sm"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                        Bạn có chắc chắn muốn xóa?
                    </p>
                    <p className="text-sm text-gray-500">
                        Mạng xã hội <strong>"{selectedSNS?.snsName}"</strong> sẽ bị xóa vĩnh viễn và không thể khôi phục.
                    </p>
                </div>
            </SNSModal>
        </div>
    );
};

export default SNSTable;
