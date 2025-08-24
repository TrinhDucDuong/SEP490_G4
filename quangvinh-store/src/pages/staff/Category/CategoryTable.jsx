import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, Image, Users, Upload } from 'lucide-react';
import DataTable from '../../../components/common/admin/DataTable';
import Modals from '../../../components/common/admin/Modals';
import Paginations from '../../../components/common/admin/Paginations';
import { CATEGORY_HELPERS, CATEGORY_DEFAULTS } from '../../../utils/constants/CategoryConstants';
import SingleImageUpload from '../../../components/common/admin/SingleImageUpload';

const CategoryTable = ({
                           categories,
                           parentCategories,
                           currentPage,
                           setCurrentPage,
                           itemsPerPage,
                           onCreateCategory,
                           onUpdateCategory,
                           onDeleteCategory,
                           loading
                       }) => {

    const [showImageModal, setShowImageModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showEditorsModal, setShowEditorsModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [newCategory, setNewCategory] = useState(CATEGORY_DEFAULTS.NEW_CATEGORY);
    const [updateCategoryData, setUpdateCategoryData] = useState(null);

    // SingleImageUpload - Create Mode
    const [createImageFile, setCreateImageFile] = useState(null);
    const [createImageError, setCreateImageError] = useState('');

    // SingleImageUpload - Update Mode
    const [updateImageFile, setUpdateImageFile] = useState(null);
    const [updateImageError, setUpdateImageError] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState(null);

    const openCreateModal = () => {
        setNewCategory(CATEGORY_DEFAULTS.NEW_CATEGORY);
        setCreateImageFile(null);
        setCreateImageError('');
        setShowCreateModal(true);
    };

    const openUpdateModal = (category) => {
        setUpdateCategoryData({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            parentCategoryId: category.parentCategory?.categoryId || null
        });

        setCurrentImageUrl(CATEGORY_HELPERS.hasImages(category) ? CATEGORY_HELPERS.getFirstImageUrl(category) : null);

        setUpdateImageFile(null);
        setUpdateImageError('');

        setSelectedCategory(category);
        setShowUpdateModal(true);
    };

    const openImageModal = (category) => {
        setSelectedCategory(category);
        setShowImageModal(true);
    };

    const openStatusModal = (category) => {
        setSelectedCategory(category);
        setShowStatusModal(true);
    };

    // CRUD operations
    const handleCreateCategory = async () => {
        if (!newCategory.categoryName.trim()) {
            alert('Vui lòng nhập tên danh mục');
            return;
        }

        if (!createImageFile) {
            setCreateImageError('Vui lòng tải lên ảnh danh mục');
            return;
        }

        setCreateImageError('');

        const result = await onCreateCategory(newCategory, createImageFile);

        if (result.success) {
            setShowCreateModal(false);
            setNewCategory(CATEGORY_DEFAULTS.NEW_CATEGORY);
            setCreateImageFile(null);
            setCreateImageError('');
            alert('Tạo danh mục thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleUpdateCategory = async () => {
        if (!updateCategoryData.categoryName.trim()) {
            alert('Vui lòng nhập tên danh mục');
            return;
        }

        let imageToSend = null;

        if (updateImageFile) {
            imageToSend = updateImageFile;
        } else if (currentImageUrl) {
            imageToSend = 'keep_existing';
        } else {
            setUpdateImageError('Vui lòng tải lên ảnh danh mục');
            return;
        }

        setUpdateImageError('');

        const result = await onUpdateCategory(
            updateCategoryData.categoryId,
            updateCategoryData,
            imageToSend
        );

        if (result.success) {
            setShowUpdateModal(false);
            setUpdateCategoryData(null);
            setCurrentImageUrl(null);
            setUpdateImageFile(null);
            setUpdateImageError('');
            alert('Cập nhật danh mục thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedCategory) return;

        const result = await onDeleteCategory(selectedCategory.categoryId);
        if (result.success) {
            setShowStatusModal(false);
            setSelectedCategory(null);
            alert('Thay đổi trạng thái thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category, index) => (
                <span className="text-sm font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </span>
            )
        },
        {
            key: 'image',
            header: 'Hình ảnh',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <div className="flex justify-center">
                    {CATEGORY_HELPERS.hasImages(category) ? (
                        <button
                            onClick={() => openImageModal(category)}
                            className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors"
                        >
                            <img
                                src={CATEGORY_HELPERS.getFirstImageUrl(category)}
                                alt={category.categoryName}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'categoryName',
            header: 'Tên danh mục',
            render: (category) => (
                <div>
                    <p className="text-sm font-medium text-gray-900">{category.categoryName}</p>
                    <p className="text-xs text-gray-500">ID: {category.categoryId}</p>
                </div>
            )
        },
        {
            key: 'parentCategory',
            header: 'Danh mục cha',
            render: (category) => (
                <span className="text-sm text-gray-700">
                    {category.parentCategory ? category.parentCategory.categoryName : 'Danh mục gốc'}
                </span>
            )
        },
        {
            key: 'createdBy',
            header: 'Người tạo',
            render: (category) => (
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        {CATEGORY_HELPERS.getUsername(category.createdBy)}
                    </p>
                    <p className="text-xs text-gray-500">
                        {CATEGORY_HELPERS.formatDate(category.createdAt)}
                    </p>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${CATEGORY_HELPERS.getStatusColorClass(category.isActive)}`}>
                    {CATEGORY_HELPERS.getStatusText(category.isActive)}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Thao tác',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => openUpdateModal(category)}
                        className="p-2 text-blue-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => openStatusModal(category)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Thay đổi trạng thái"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ]

    // Pagination
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const currentCategories = categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                        Tìm thấy {categories.length} danh mục
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm danh mục
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={currentCategories}
                loading={loading}
                emptyMessage="Không có danh mục nào"
            />

            {/* Pagination */}
            <div className="p-6 border-t border-gray-200">
                <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={categories.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    itemName="danh mục"
                />
            </div>

            {/* Image Modal */}
            <Modals
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                title="Hình ảnh danh mục"
                size="lg"
            >
                {selectedCategory && CATEGORY_HELPERS.hasImages(selectedCategory) ? (
                    <div className="text-center">
                        <img
                            src={CATEGORY_HELPERS.getFirstImageUrl(selectedCategory)}
                            alt={selectedCategory.categoryName}
                            className="max-w-full max-h-96 mx-auto rounded-lg"
                        />
                        <p className="mt-4 text-sm text-gray-600">{selectedCategory.categoryName}</p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Không có hình ảnh</p>
                    </div>
                )}
            </Modals>

            {/* Create Modal */}
            <Modals
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm danh mục mới"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục *
                        </label>
                        <input
                            type="text"
                            value={newCategory.categoryName}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, categoryName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên danh mục"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Danh mục cha
                        </label>
                        <select
                            value={newCategory.parentCategoryId || ''}
                            onChange={(e) => setNewCategory(prev => ({
                                ...prev,
                                parentCategoryId: e.target.value || null
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tạo danh mục gốc</option>
                            {parentCategories.filter(parent => parent.isActive).map(parent => (
                                <option key={parent.categoryId} value={parent.categoryId}>
                                    {parent.categoryName}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Nếu không chọn danh mục cha, danh mục này sẽ trở thành danh mục gốc
                        </p>
                    </div>

                    {/* SingleImageUpload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Hình ảnh danh mục *
                        </label>
                        <SingleImageUpload
                            imageFile={createImageFile}
                            setImageFile={setCreateImageFile}
                            error={createImageError}
                            setError={setCreateImageError}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreateCategory}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Tạo danh mục
                        </button>
                    </div>
                </div>
            </Modals>

            {/* Update Modal */}
            <Modals
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật danh mục"
            >
                {updateCategoryData && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên danh mục *
                            </label>
                            <input
                                type="text"
                                value={updateCategoryData.categoryName}
                                onChange={(e) => setUpdateCategoryData(prev => ({ ...prev, categoryName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tên danh mục"
                            />
                        </div>

                        {/* Parent Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục cha
                            </label>
                            <select
                                value={updateCategoryData.parentCategoryId || ''}
                                onChange={(e) => setUpdateCategoryData(prev => ({
                                    ...prev,
                                    parentCategoryId: e.target.value || null
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Chọn danh mục cha</option>
                                {parentCategories.filter(parent => parent.isActive).map(parent => (
                                    <option key={parent.categoryId} value={parent.categoryId}>
                                        {parent.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Hình ảnh danh mục *
                            </label>

                            {currentImageUrl && !updateImageFile && (
                                <div className="mb-3">
                                    <p className="text-sm text-gray-600 mb-2">Ảnh hiện tại:</p>
                                    <img
                                        src={currentImageUrl}
                                        alt="Ảnh hiện tại"
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                </div>
                            )}

                            <SingleImageUpload
                                imageFile={updateImageFile}
                                setImageFile={setUpdateImageFile}
                                error={updateImageError}
                                setError={setUpdateImageError}
                            />

                            {currentImageUrl && (
                                <p className="text-sm text-gray-500 mt-2">
                                    {updateImageFile ? 'Ảnh mới sẽ thay thế ảnh hiện tại' : 'Chọn ảnh mới để thay thế ảnh hiện tại'}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateCategory}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Cập nhật danh mục
                            </button>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Status Modal */}
            <Modals
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Xác nhận thay đổi trạng thái"
            >
                {selectedCategory && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            {selectedCategory.isActive
                                ? `Bạn muốn ngừng bán danh mục "${selectedCategory.categoryName}" không?`
                                : `Bạn muốn kích hoạt lại danh mục "${selectedCategory.categoryName}" không?`
                            }
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleStatusChange}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Editors Modal */}
            <Modals
                isOpen={showEditorsModal}
                onClose={() => setShowEditorsModal(false)}
                title="Lịch sử chỉnh sửa"
                size="lg"
            >
                {selectedCategory && (
                    <div className="space-y-4">
                        {CATEGORY_HELPERS.getEditorsFromCategory(selectedCategory).length > 0 ? (
                            <div className="space-y-3">
                                {CATEGORY_HELPERS.getEditorsFromCategory(selectedCategory).map(editor => (
                                    <div key={editor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-blue-600">
                                                    {editor.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{editor.username}</p>
                                                <p className="text-xs text-gray-500">{editor.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-900">{editor.action}</p>
                                            <p className="text-xs text-gray-500">
                                                {CATEGORY_HELPERS.formatDate(editor.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Chưa có lịch sử chỉnh sửa</p>
                            </div>
                        )}
                    </div>
                )}
            </Modals>
        </div>
    );
};

export default CategoryTable;
