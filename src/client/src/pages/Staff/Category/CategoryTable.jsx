// src/pages/Staff/Category/CategoryTable.jsx
import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, Image, Users, Upload } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modals from '../../../components/common/Admin/Modals';
import Paginations from '../../../components/common/Admin/Paginations';
import { CATEGORY_HELPERS, CATEGORY_DEFAULTS } from '../../../utils/constants/CategoryConstants';

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
    // Modal states - ĐỒNG NHẤT với Brand
    const [showImageModal, setShowImageModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showEditorsModal, setShowEditorsModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Form states - ĐỒNG NHẤT với Brand
    const [newCategory, setNewCategory] = useState(CATEGORY_DEFAULTS.NEW_CATEGORY);
    const [updateCategoryData, setUpdateCategoryData] = useState(null);

    // Image management states - ĐỒNG NHẤT với Brand
    const [currentImage, setCurrentImage] = useState(null);
    const [imageToDelete, setImageToDelete] = useState(false);

    // Image validation states - ĐỒNG NHẤT với Brand
    const [imageValidation, setImageValidation] = useState({
        create: { show: false, message: '' },
        update: { show: false, message: '' }
    });

    // File upload handlers - ĐỒNG NHẤT với Brand
    const handleFileUpload = (file, isUpdate = false) => {
        if (!file) return;

        if (isUpdate) {
            setUpdateCategoryData(prev => ({ ...prev, categoryImage: file }));
            setImageValidation(prev => ({ ...prev, update: { show: false, message: '' } }));
        } else {
            setNewCategory(prev => ({ ...prev, categoryImage: file }));
            setImageValidation(prev => ({ ...prev, create: { show: false, message: '' } }));
        }
    };

    // Modal handlers - ĐỒNG NHẤT với Brand
    const openCreateModal = () => {
        setNewCategory(CATEGORY_DEFAULTS.NEW_CATEGORY);
        setImageValidation({
            create: { show: false, message: '' },
            update: { show: false, message: '' }
        });
        setShowCreateModal(true);
    };

    const openUpdateModal = (category) => {
        setUpdateCategoryData({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            parentCategoryId: category.parentCategory?.categoryId || null,
            categoryImage: null
        });

        setCurrentImage(CATEGORY_HELPERS.hasImages(category) ? CATEGORY_HELPERS.getFirstImageUrl(category) : null);
        setImageToDelete(false);
        setImageValidation({
            create: { show: false, message: '' },
            update: { show: false, message: '' }
        });
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

    const openEditorsModal = (category) => {
        setSelectedCategory(category);
        setShowEditorsModal(true);
    };

    // CRUD operations - ĐỒNG NHẤT với Brand
    const handleCreateCategory = async () => {
        if (!newCategory.categoryName.trim()) {
            alert('Vui lòng nhập tên danh mục');
            return;
        }

        // THÊM: Validation cho ảnh giống Brand
        if (!newCategory.categoryImage) {
            setImageValidation(prev => ({
                ...prev,
                create: { show: true, message: 'Vui lòng tải lên ảnh danh mục' }
            }));
            return;
        }

        // Reset validation nếu có ảnh
        setImageValidation(prev => ({ ...prev, create: { show: false, message: '' } }));

        const result = await onCreateCategory(newCategory, newCategory.categoryImage);
        if (result.success) {
            setShowCreateModal(false);
            setNewCategory(CATEGORY_DEFAULTS.NEW_CATEGORY);
            setImageValidation(prev => ({ ...prev, create: { show: false, message: '' } }));
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

        // Xử lý logic ảnh - ĐỒNG NHẤT với Brand
        let imageToSend = null;
        if (imageToDelete) {
            // Người dùng muốn xóa ảnh hiện tại
            if (!updateCategoryData.categoryImage) {
                // Không có ảnh mới để thay thế
                setImageValidation(prev => ({
                    ...prev,
                    update: { show: true, message: 'Vui lòng tải lên ảnh danh mục' }
                }));
                return;
            }
            imageToSend = updateCategoryData.categoryImage;
        } else if (updateCategoryData.categoryImage) {
            // Người dùng upload ảnh mới
            imageToSend = updateCategoryData.categoryImage;
        } else {
            // Giữ nguyên ảnh cũ
            imageToSend = 'keep_existing';
        }

        // Reset validation
        setImageValidation(prev => ({ ...prev, update: { show: false, message: '' } }));

        const result = await onUpdateCategory(
            updateCategoryData.categoryId,
            updateCategoryData,
            imageToSend
        );

        if (result.success) {
            setShowUpdateModal(false);
            setUpdateCategoryData(null);
            setCurrentImage(null);
            setImageToDelete(false);
            setImageValidation(prev => ({ ...prev, update: { show: false, message: '' } }));
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

    // Table columns configuration - ĐỒNG NHẤT với Brand
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
            key: 'actions',
            header: 'Thao tác',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (category) => (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => openImageModal(category)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem ảnh"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => openUpdateModal(category)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
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
                    <button
                        onClick={() => openEditorsModal(category)}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Lịch sử chỉnh sửa"
                    >
                        <Users className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Pagination - ĐỒNG NHẤT với Brand
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const currentCategories = categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header - ĐỒNG NHẤT với Brand */}
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

            {/* Image Modal - ĐỒNG NHẤT với Brand */}
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

            {/* Create Modal - ĐỒNG NHẤT với Brand */}
            <Modals
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm danh mục mới"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên danh mục *
                        </label>
                        <input
                            type="text"
                            value={newCategory.categoryName}
                            onChange={(e) => setNewCategory(prev => ({ ...prev, categoryName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tên danh mục"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danh mục cha
                        </label>
                        <select
                            value={newCategory.parentCategoryId || ''}
                            onChange={(e) => setNewCategory(prev => ({
                                ...prev,
                                parentCategoryId: e.target.value ? parseInt(e.target.value) : null
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tạo danh mục gốc</option>
                            {parentCategories.map(category => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Nếu không chọn danh mục cha, danh mục này sẽ trở thành danh mục gốc
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh danh mục *
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 800x400px)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e.target.files[0], false)}
                                />
                            </label>
                        </div>
                        {imageValidation.create.show && (
                            <p className="mt-1 text-sm text-red-600">{imageValidation.create.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreateCategory}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Tạo danh mục
                        </button>
                    </div>
                </div>
            </Modals>

            {/* Update Modal - ĐỒNG NHẤT với Brand */}
            <Modals
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật danh mục"
                size="lg"
            >
                {updateCategoryData && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên danh mục *
                            </label>
                            <input
                                type="text"
                                value={updateCategoryData.categoryName}
                                onChange={(e) => setUpdateCategoryData(prev => ({ ...prev, categoryName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tên danh mục"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục cha
                            </label>
                            <select
                                value={updateCategoryData.parentCategoryId || ''}
                                onChange={(e) => setUpdateCategoryData(prev => ({
                                    ...prev,
                                    parentCategoryId: e.target.value ? parseInt(e.target.value) : null
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Danh mục gốc</option>
                                {parentCategories.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hình ảnh danh mục *
                            </label>

                            {/* Current Image Display - ĐỒNG NHẤT với Brand */}
                            {currentImage && !imageToDelete && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Hình ảnh hiện tại</p>
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={currentImage}
                                            alt="Current"
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                        <button
                                            onClick={() => setImageToDelete(true)}
                                            className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                                        >
                                            Xóa ảnh này
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Validation Message */}
                            {imageValidation.update.show && (
                                <p className="mb-2 text-sm text-red-600">{imageValidation.update.message}</p>
                            )}

                            {/* New Image Preview */}
                            {updateCategoryData.categoryImage && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Ảnh mới</p>
                                    <img
                                        src={URL.createObjectURL(updateCategoryData.categoryImage)}
                                        alt="New"
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                </div>
                            )}

                            {/* File Upload */}
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {currentImage && !imageToDelete ? "Chọn ảnh mới để thay thế, hoặc nhấn 'Xóa ảnh này' để xóa ảnh hiện tại" : "Chọn ảnh mới cho danh mục"}
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e.target.files[0], true)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateCategory}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Status Modal - ĐỒNG NHẤT với Brand */}
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

            {/* Editors Modal - ĐỒNG NHẤT với Brand */}
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
