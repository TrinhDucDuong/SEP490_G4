import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, FileText } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modals from '../../../components/common/Admin/Modals';
import Paginations from '../../../components/common/Admin/Paginations';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { POLICY_HELPERS, POLICY_DEFAULTS } from '../../../utils/constants/PoliciesConstants';

const PoliciesTable = ({
                           policies,                    // ← Đây là paginatedPolicies (10 items)
                           currentPage,
                           setCurrentPage,
                           itemsPerPage,
                           totalItems,                  // ← Thêm prop này (tổng số items)
                           totalPages,                  // ← Thêm prop này (tổng số trang)
                           onCreatePolicy,
                           onUpdatePolicy,
                           onDeletePolicy,
                           loading
                       }) => {
    // Modal states
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    // Form states
    const [newPolicy, setNewPolicy] = useState(POLICY_DEFAULTS.NEW_POLICY);
    const [updatePolicyData, setUpdatePolicyData] = useState(null);

    // Modal handlers
    const openCreateModal = () => {
        setNewPolicy(POLICY_DEFAULTS.NEW_POLICY);
        setShowCreateModal(true);
    };

    const openUpdateModal = (policy) => {
        setUpdatePolicyData({
            policyId: policy.policyId,
            policyName: policy.policyName,
            policyDescription: policy.policyDescription
        });
        setSelectedPolicy(policy);
        setShowUpdateModal(true);
    };

    const openDescriptionModal = (policy) => {
        setSelectedPolicy(policy);
        setShowDescriptionModal(true);
    };

    const openDeleteModal = (policy) => {
        setSelectedPolicy(policy);
        setShowDeleteModal(true);
    };

    // CRUD operations
    const handleCreatePolicy = async () => {
        if (!newPolicy.policyName.trim()) {
            alert('Vui lòng nhập tên chính sách');
            return;
        }

        if (!newPolicy.policyDescription.trim()) {
            alert('Vui lòng nhập mô tả chính sách');
            return;
        }

        const result = await onCreatePolicy(newPolicy);
        if (result.success) {
            setShowCreateModal(false);
            setNewPolicy(POLICY_DEFAULTS.NEW_POLICY);
            alert('Tạo chính sách thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleUpdatePolicy = async () => {
        if (!updatePolicyData.policyName.trim()) {
            alert('Vui lòng nhập tên chính sách');
            return;
        }

        if (!updatePolicyData.policyDescription.trim()) {
            alert('Vui lòng nhập mô tả chính sách');
            return;
        }

        const result = await onUpdatePolicy(updatePolicyData.policyId, updatePolicyData);
        if (result.success) {
            setShowUpdateModal(false);
            setUpdatePolicyData(null);
            alert('Cập nhật chính sách thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleDeletePolicy = async () => {
        if (!selectedPolicy) return;

        const result = await onDeletePolicy(selectedPolicy.policyId);
        if (result.success) {
            setShowDeleteModal(false);
            setSelectedPolicy(null);
            alert('Xóa chính sách thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    // Table columns configuration - CẬP NHẬT CĂN GIỮA
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (policy, index) => (
                <span className="font-medium text-gray-900">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
            )
        },
        {
            key: 'policyName',
            header: 'Tên chính sách',
            headerAlign: 'text-center',  // ← Thay đổi từ text-left thành text-center
            cellAlign: 'text-center',    // ← Thay đổi từ text-left thành text-center
            render: (policy) => (
                <div className="flex flex-col items-center">  {/* ← Thêm flex và items-center */}
                    <div className="font-medium text-gray-900 text-center max-w-xs">
                        {policy.policyName}
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                        ID: {policy.policyId}
                    </div>
                </div>
            )
        },
        {
            key: 'policyDescription',
            header: 'Mô tả',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (policy) => (
                <div className="flex justify-center">  {/* ← Thêm flex justify-center */}
                    <button
                        onClick={() => openDescriptionModal(policy)}
                        className="flex items-center justify-center gap-2 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Xem mô tả
                    </button>
                </div>
            )
        },
        {
            key: 'createdAt',
            header: 'Ngày tạo',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (policy) => (
                <div className="text-sm text-gray-900 text-center">
                    {POLICY_HELPERS.formatDate(policy.createdAt)}
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (policy) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => openUpdateModal(policy)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => openDeleteModal(policy)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Tìm thấy {totalItems} chính sách {/* ← Sử dụng totalItems */}
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm chính sách
                    </button>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={policies}
                loading={loading}
                emptyMessage="Không có chính sách nào"
            />

            {/* Pagination */}
            <div className="p-6 border-t border-gray-200">
                <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                />
            </div>

            {/* Description Modal */}
            <Modals
                isOpen={showDescriptionModal}
                onClose={() => setShowDescriptionModal(false)}
                title="Mô tả chính sách"
                size="lg"
            >
                {selectedPolicy && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {selectedPolicy.policyName}
                            </h3>
                            <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: selectedPolicy.policyDescription }} />
                            </div>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Create Modal */}
            <Modals
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Tạo chính sách mới"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên chính sách *
                        </label>
                        <input
                            type="text"
                            value={newPolicy.policyName}
                            onChange={(e) => setNewPolicy(prev => ({ ...prev, policyName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên chính sách"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả chính sách *
                        </label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={newPolicy.policyDescription}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewPolicy(prev => ({ ...prev, policyDescription: data }));
                            }}
                            config={{
                                placeholder: 'Nhập mô tả chính sách...'
                            }}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreatePolicy}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Đang tạo...' : 'Tạo chính sách'}
                        </button>
                    </div>
                </div>
            </Modals>

            {/* Update Modal */}
            <Modals
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật chính sách"
                size="lg"
            >
                {updatePolicyData && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên chính sách *
                            </label>
                            <input
                                type="text"
                                value={updatePolicyData.policyName}
                                onChange={(e) => setUpdatePolicyData(prev => ({ ...prev, policyName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên chính sách"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả chính sách *
                            </label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={updatePolicyData.policyDescription}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setUpdatePolicyData(prev => ({ ...prev, policyDescription: data }));
                                }}
                                config={{
                                    placeholder: 'Nhập mô tả chính sách...'
                                }}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdatePolicy}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Delete Modal */}
            <Modals
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
                size="sm"
            >
                {selectedPolicy && (
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Bạn có chắc chắn muốn xóa chính sách{' '}
                            <span className="font-semibold">"{selectedPolicy.policyName}"</span> không?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeletePolicy}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                )}
            </Modals>
        </div>
    );
};

export default PoliciesTable;
