import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, FileText } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import DataTable from '../../../components/common/admin/DataTable';
import Modals from '../../../components/common/admin/Modals';
import Paginations from '../../../components/common/admin/Paginations';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { INSTRUCTION_HELPERS, INSTRUCTION_DEFAULTS } from '../../../utils/constants/InstructionConstants';

const InstructionTable = ({
                              instructions,
                              currentPage,
                              setCurrentPage,
                              itemsPerPage,
                              totalItems,
                              totalPages,
                              onCreateInstruction,
                              onUpdateInstruction,
                              onDeleteInstruction,
                              loading
                          }) => {
    // Modal states
    const { showSuccess, showError } = useToast();
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedInstruction, setSelectedInstruction] = useState(null);

    // Form states
    const [newInstruction, setNewInstruction] = useState(INSTRUCTION_DEFAULTS.NEW_INSTRUCTION);
    const [updateInstructionData, setUpdateInstructionData] = useState(null);

    // Modal handlers
    const openCreateModal = () => {
        setNewInstruction(INSTRUCTION_DEFAULTS.NEW_INSTRUCTION);
        setShowCreateModal(true);
    };

    const openUpdateModal = (instruction) => {
        setUpdateInstructionData({
            instructionId: instruction.instructionId,
            instructionName: instruction.instructionName,
            instructionDescription: instruction.instructionDescription
        });
        setSelectedInstruction(instruction);
        setShowUpdateModal(true);
    };

    const openDescriptionModal = (instruction) => {
        setSelectedInstruction(instruction);
        setShowDescriptionModal(true);
    };

    const openDeleteModal = (instruction) => {
        setSelectedInstruction(instruction);
        setShowDeleteModal(true);
    };

    // CRUD operations
    const handleCreateInstruction = async () => {
        if (!newInstruction.instructionName.trim()) {
            showError('Vui lòng nhập tên hướng dẫn');
            return;
        }

        if (!newInstruction.instructionDescription.trim()) {
            showError('Vui lòng nhập mô tả hướng dẫn');
            return;
        }

        const result = await onCreateInstruction(newInstruction);
        if (result.success) {
            setShowCreateModal(false);
            setNewInstruction(INSTRUCTION_DEFAULTS.NEW_INSTRUCTION);
            showSuccess('Tạo hướng dẫn thành công!');
        } else {
            showError(`Lỗi: ${result.error}`);
        }
    };

    const handleUpdateInstruction = async () => {
        if (!updateInstructionData.instructionName.trim()) {
            showError('Vui lòng nhập tên hướng dẫn');
            return;
        }

        if (!updateInstructionData.instructionDescription.trim()) {
            showError('Vui lòng nhập mô tả hướng dẫn');
            return;
        }

        const result = await onUpdateInstruction(updateInstructionData.instructionId, updateInstructionData);
        if (result.success) {
            setShowUpdateModal(false);
            setUpdateInstructionData(null);
            showSuccess('Cập nhật hướng dẫn thành công!');
        } else {
            showError(`Lỗi: ${result.error}`);
        }
    };

    const handleDeleteInstruction = async () => {
        if (!selectedInstruction) return;

        const result = await onDeleteInstruction(selectedInstruction.instructionId);
        if (result.success) {
            setShowDeleteModal(false);
            setSelectedInstruction(null);
            showSuccess('Xóa hướng dẫn thành công!');
        } else {
            showError(`Lỗi: ${result.error}`);
        }
    };

    // Table columns configuration
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (instruction, index) => (
                <span className="font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
            )
        },
        {
            key: 'instructionName',
            header: 'Tên hướng dẫn',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (instruction) => (
                <span className="font-medium text-gray-900">
                    {instruction.instructionName}
                </span>
            )
        },
        {
            key: 'instructionDescription',
            header: 'Mô tả',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (instruction) => (
                <button
                    onClick={() => openDescriptionModal(instruction)}
                    className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors mx-auto"
                >
                    <Eye size={16} />
                    <span>Xem mô tả</span>
                </button>
            )
        },
        {
            key: 'createdAt',
            header: 'Ngày tạo',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (instruction) => (
                <span className="text-gray-600">
                    {INSTRUCTION_HELPERS.formatDate(instruction.createdAt)}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (instruction) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => openUpdateModal(instruction)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật hướng dẫn"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => openDeleteModal(instruction)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa hướng dẫn"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Danh sách hướng dẫn</h2>
                    <p className="text-sm text-gray-600">
                        Hiển thị {instructions.length} hướng dẫn
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    Thêm hướng dẫn mới
                </button>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={instructions}
                loading={loading}
                emptyMessage="Không có hướng dẫn nào được tìm thấy"
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                />
            )}

            {/* Description Modal */}
            <Modals
                isOpen={showDescriptionModal}
                onClose={() => setShowDescriptionModal(false)}
                title="Mô tả hướng dẫn"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                            {selectedInstruction?.instructionName}
                        </h3>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: selectedInstruction?.instructionDescription || ''
                            }}
                        />
                    </div>
                </div>
            </Modals>

            {/* Create Modal */}
            <Modals
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Tạo hướng dẫn mới"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên hướng dẫn *
                        </label>
                        <input
                            type="text"
                            value={newInstruction.instructionName}
                            onChange={(e) => setNewInstruction(prev => ({
                                ...prev,
                                instructionName: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tên hướng dẫn..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả hướng dẫn *
                        </label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={newInstruction.instructionDescription}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewInstruction(prev => ({
                                    ...prev,
                                    instructionDescription: data
                                }));
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
                            onClick={handleCreateInstruction}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Tạo hướng dẫn
                        </button>
                    </div>
                </div>
            </Modals>

            {/* Update Modal */}
            <Modals
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật hướng dẫn"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên hướng dẫn *
                        </label>
                        <input
                            type="text"
                            value={updateInstructionData?.instructionName || ''}
                            onChange={(e) => setUpdateInstructionData(prev => ({
                                ...prev,
                                instructionName: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tên hướng dẫn..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả hướng dẫn *
                        </label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={updateInstructionData?.instructionDescription || ''}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setUpdateInstructionData(prev => ({
                                    ...prev,
                                    instructionDescription: data
                                }));
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
                            onClick={handleUpdateInstruction}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            </Modals>

            {/* Delete Confirmation Modal */}
            <Modals
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa hướng dẫn"
                size="md"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Trash2 size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-gray-900">
                                Bạn có chắc chắn muốn xóa hướng dẫn{' '}
                                <span className="font-medium">"{selectedInstruction?.instructionName}"</span> không?
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Hành động này không thể hoàn tác.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleDeleteInstruction}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Xóa hướng dẫn
                        </button>
                    </div>
                </div>
            </Modals>
        </div>
    );
};

export default InstructionTable;
