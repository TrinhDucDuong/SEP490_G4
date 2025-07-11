import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, Image, FileText, Users } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modals from '../../../components/common/Admin/Modals';
import Paginations from '../../../components/common/Admin/Paginations';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BRAND_HELPERS, BRAND_DEFAULTS } from '../../../utils/constants/BrandConstants';

const BrandTable = ({
                        brands,
                        currentPage,
                        setCurrentPage,
                        itemsPerPage,
                        onCreateBrand,
                        onUpdateBrand,
                        onDeleteBrand,
                        loading
                    }) => {
    // Modal states
    const [showImageModal, setShowImageModal] = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showEditorsModal, setShowEditorsModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);

    // Form states
    const [newBrand, setNewBrand] = useState(BRAND_DEFAULTS.NEW_BRAND);
    const [updateBrandData, setUpdateBrandData] = useState(null);

    // Image management states
    const [currentImage, setCurrentImage] = useState(null);
    const [imageToDelete, setImageToDelete] = useState(false);

    // NEW: Image validation states
    const [imageValidation, setImageValidation] = useState({
        create: { show: false, message: '' },
        update: { show: false, message: '' }
    });

    // File upload handlers
    const handleFileUpload = (file, isUpdate = false) => {
        if (!file) return;

        if (isUpdate) {
            setUpdateBrandData(prev => ({ ...prev, brandImage: file }));
            // Reset validation khi có file
            setImageValidation(prev => ({
                ...prev,
                update: { show: false, message: '' }
            }));
        } else {
            setNewBrand(prev => ({ ...prev, brandImage: file }));
            // Reset validation khi có file
            setImageValidation(prev => ({
                ...prev,
                create: { show: false, message: '' }
            }));
        }
    };

    // Modal handlers
    const openCreateModal = () => {
        setNewBrand(BRAND_DEFAULTS.NEW_BRAND);
        setImageValidation({
            create: { show: false, message: '' },
            update: { show: false, message: '' }
        });
        setShowCreateModal(true);
    };

    const openUpdateModal = (brand) => {
        setUpdateBrandData({
            brandId: brand.brandId,
            brandName: brand.brandName,
            brandDescription: brand.brandDescription,
            brandImage: null
        });

        // Set current image and reset delete flag
        setCurrentImage(BRAND_HELPERS.hasImages(brand) ? BRAND_HELPERS.getFirstImageUrl(brand) : null);
        setImageToDelete(false);
        setImageValidation({
            create: { show: false, message: '' },
            update: { show: false, message: '' }
        });
        setSelectedBrand(brand);
        setShowUpdateModal(true);
    };

    const openImageModal = (brand) => {
        setSelectedBrand(brand);
        setShowImageModal(true);
    };

    const openDescriptionModal = (brand) => {
        setSelectedBrand(brand);
        setShowDescriptionModal(true);
    };

    const openStatusModal = (brand) => {
        setSelectedBrand(brand);
        setShowStatusModal(true);
    };

    const openEditorsModal = (brand) => {
        setSelectedBrand(brand);
        setShowEditorsModal(true);
    };

    // CRUD operations
    const handleCreateBrand = async () => {
        if (!newBrand.brandName.trim()) {
            alert('Vui lòng nhập tên thương hiệu');
            return;
        }

        // THÊM: Validation cho ảnh
        if (!newBrand.brandImage) {
            setImageValidation(prev => ({
                ...prev,
                create: { show: true, message: 'Vui lòng tải lên ảnh thương hiệu' }
            }));
            return;
        }

        // Reset validation nếu có ảnh
        setImageValidation(prev => ({
            ...prev,
            create: { show: false, message: '' }
        }));

        const result = await onCreateBrand(newBrand, newBrand.brandImage);
        if (result.success) {
            setShowCreateModal(false);
            setNewBrand(BRAND_DEFAULTS.NEW_BRAND);
            setImageValidation(prev => ({
                ...prev,
                create: { show: false, message: '' }
            }));
            alert('Tạo thương hiệu thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleUpdateBrand = async () => {
        if (!updateBrandData.brandName.trim()) {
            alert('Vui lòng nhập tên thương hiệu');
            return;
        }

        // Xử lý logic ảnh
        let imageToSend = null;

        if (imageToDelete) {
            // Người dùng muốn xóa ảnh hiện tại
            if (!updateBrandData.brandImage) {
                // Không có ảnh mới để thay thế
                setImageValidation(prev => ({
                    ...prev,
                    update: { show: true, message: 'Vui lòng tải lên ảnh thương hiệu' }
                }));
                return;
            }
            imageToSend = updateBrandData.brandImage;
        } else if (updateBrandData.brandImage) {
            // Người dùng upload ảnh mới
            imageToSend = updateBrandData.brandImage;
        } else {
            // Giữ nguyên ảnh cũ
            imageToSend = 'keep_existing';
        }

        // Reset validation
        setImageValidation(prev => ({
            ...prev,
            update: { show: false, message: '' }
        }));

        const result = await onUpdateBrand(
            updateBrandData.brandId,
            updateBrandData,
            imageToSend
        );

        if (result.success) {
            setShowUpdateModal(false);
            setUpdateBrandData(null);
            setCurrentImage(null);
            setImageToDelete(false);
            setImageValidation(prev => ({
                ...prev,
                update: { show: false, message: '' }
            }));
            alert('Cập nhật thương hiệu thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedBrand) return;

        const result = await onDeleteBrand(selectedBrand.brandId);
        if (result.success) {
            setShowStatusModal(false);
            setSelectedBrand(null);
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
            render: (brand, index) => (
                <span className="font-medium text-gray-900">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
            )
        },
        {
            key: 'image',
            header: 'Hình ảnh',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (brand) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => openImageModal(brand)}
                        className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors"
                    >
                        {BRAND_HELPERS.hasImages(brand) ? (
                            <img
                                src={BRAND_HELPERS.getFirstImageUrl(brand)}
                                alt={brand.brandName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Image className="w-5 h-5 text-gray-400" />
                            </div>
                        )}
                    </button>
                </div>
            )
        },
        {
            key: 'brandName',
            header: 'Tên thương hiệu',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (brand) => (
                <div>
                    <div className="font-medium text-gray-900">{brand.brandName}</div>
                </div>
            )
        },
        {
            key: 'brandDescription',
            header: 'Mô tả',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (brand) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => openDescriptionModal(brand)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Mô tả thương hiệu
                    </button>
                </div>
            )
        },
        {
            key: 'creator',
            header: 'Người tạo',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (brand) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {BRAND_HELPERS.getUsername(brand.createdBy)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {BRAND_HELPERS.formatDate(brand.createdAt)}
                    </div>
                </div>
            )
        },
        {
            key: 'updater',
            header: 'Lịch sử chỉnh sửa', // CHANGED from "Người chỉnh sửa"
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (brand) => {
                const editorsList = BRAND_HELPERS.getEditorsFromBrand(brand);
                const editorsCount = editorsList.length;

                return (
                    <div className="flex justify-center">
                        <button
                            onClick={() => openEditorsModal(brand)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            <span className="text-sm">Lịch sử chỉnh sửa</span> {/* CHANGED button text */}
                        </button>
                    </div>
                );
            }
        },
        {
            key: 'isActive',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (brand) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${BRAND_HELPERS.getStatusColorClass(brand.isActive)}`}>
          {BRAND_HELPERS.getStatusText(brand.isActive)}
        </span>
            )
        },
        {
            key: 'actions',
            header: 'Thao tác',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (brand) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => openUpdateModal(brand)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => openStatusModal(brand)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={brand.isActive ? "Ngừng bán" : "Kích hoạt lại"}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = brands.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(brands.length / itemsPerPage);

    return (
        <div>
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Danh sách thương hiệu</h2>
                    <p className="text-gray-600 mt-1">
                        Tìm thấy {brands.length} thương hiệu
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Thêm thương hiệu
                </button>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={currentItems}
                loading={loading}
                emptyMessage="Không có thương hiệu nào"
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6">
                    <Paginations
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={brands.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        itemName="thương hiệu"
                    />
                </div>
            )}

            {/* Modals */}

            {/* Image Modal */}
            <Modals
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                title="Hình ảnh thương hiệu"
                size="md"
            >
                {selectedBrand && (
                    <div className="text-center">
                        <h3 className="text-lg font-medium mb-4">{selectedBrand.brandName}</h3>
                        {BRAND_HELPERS.hasImages(selectedBrand) ? (
                            <img
                                src={BRAND_HELPERS.getFirstImageUrl(selectedBrand)}
                                alt={selectedBrand.brandName}
                                className="max-w-full h-auto rounded-lg mx-auto"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Image className="w-12 h-12 text-gray-400" />
                                <span className="ml-2 text-gray-500">Chưa có hình ảnh</span>
                            </div>
                        )}
                    </div>
                )}
            </Modals>

            {/* Description Modal - SIMPLIFIED (removed image) */}
            <Modals
                isOpen={showDescriptionModal}
                onClose={() => setShowDescriptionModal(false)}
                title="Mô tả thương hiệu"
                size="lg"
            >
                {selectedBrand && (
                    <div>
                        {/* Header chỉ có tên thương hiệu - BỎ ảnh */}
                        <div className="mb-4 pb-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">{selectedBrand.brandName}</h3>
                        </div>

                        <div className="prose max-w-none">
                            {selectedBrand.brandDescription ? (
                                <div dangerouslySetInnerHTML={{ __html: selectedBrand.brandDescription }} />
                            ) : (
                                <div className="text-gray-500 italic text-center py-8">
                                    Chưa có mô tả cho thương hiệu này
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modals>

            {/* Editors List Modal - SIMPLIFIED (removed image) */}
            <Modals
                isOpen={showEditorsModal}
                onClose={() => setShowEditorsModal(false)}
                title="Danh sách người chỉnh sửa"
                size="md"
            >
                {selectedBrand && (
                    <div>
                        {/* Header chỉ có tên thương hiệu - BỎ ảnh */}
                        <div className="mb-6 pb-4 border-b">
                            <h3 className="text-lg font-medium text-gray-900">{selectedBrand.brandName}</h3>
                        </div>

                        <div className="space-y-4">
                            {BRAND_HELPERS.getEditorsFromBrand(selectedBrand).map((editor, index) => (
                                <div key={editor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {editor.username?.charAt(0).toUpperCase()}
                    </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{editor.username}</div>
                                        <div className="text-xs text-gray-500">{editor.email}</div>
                                        <div className="text-sm text-gray-600 mt-1">{editor.action}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {BRAND_HELPERS.formatDate(editor.timestamp)}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        #{index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {BRAND_HELPERS.getEditorsFromBrand(selectedBrand).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Chưa có lịch sử chỉnh sửa</p>
                            </div>
                        )}
                    </div>
                )}
            </Modals>

            {/* Create Modal - với validation message */}
            <Modals
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm thương hiệu mới"
                size="lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên thương hiệu *
                        </label>
                        <input
                            type="text"
                            value={newBrand.brandName}
                            onChange={(e) => setNewBrand(prev => ({ ...prev, brandName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tên thương hiệu"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả thương hiệu
                        </label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={newBrand.brandDescription}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewBrand(prev => ({ ...prev, brandDescription: data }));
                            }}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh thương hiệu *
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files[0], false)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        {/* THÊM: Validation message */}
                        {imageValidation.create.show && (
                            <p className="text-red-600 text-sm mt-2">
                                {imageValidation.create.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreateBrand}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Tạo thương hiệu
                        </button>
                    </div>
                </div>
            </Modals>

            {/* Update Modal - ENHANCED with Image Management */}
            <Modals
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật thương hiệu"
                size="lg"
            >
                {updateBrandData && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên thương hiệu *
                            </label>
                            <input
                                type="text"
                                value={updateBrandData.brandName}
                                onChange={(e) => setUpdateBrandData(prev => ({ ...prev, brandName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tên thương hiệu"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả thương hiệu
                            </label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={updateBrandData.brandDescription}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setUpdateBrandData(prev => ({ ...prev, brandDescription: data }));
                                }}
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                                }}
                            />
                        </div>

                        {/* Enhanced Image Management Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hình ảnh thương hiệu
                            </label>

                            {/* Current Image Display */}
                            {currentImage && !imageToDelete && (
                                <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={currentImage}
                                            alt={selectedBrand?.brandName}
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 mb-2">Hình ảnh hiện tại</p>
                                            <button
                                                type="button"
                                                onClick={() => setImageToDelete(true)}
                                                className="flex items-center gap-2 px-3 py-1 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
                                            >
                                                <span className="text-lg">×</span>
                                                Xóa ảnh này
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Image Deleted State */}
                            {imageToDelete && (
                                <div className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-600">⚠️</span>
                                            <span className="text-red-700 text-sm">Ảnh sẽ bị xóa khi cập nhật</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setImageToDelete(false)}
                                            className="text-blue-600 hover:text-blue-700 text-sm underline"
                                        >
                                            Hoàn tác
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* New Image Upload */}
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        handleFileUpload(e.target.files[0], true);
                                        if (e.target.files[0]) {
                                            setImageToDelete(false); // Reset delete flag if new image selected
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />

                                {/* THÊM: Validation message */}
                                {imageValidation.update.show && (
                                    <p className="text-red-600 text-sm mt-2">
                                        {imageValidation.update.message}
                                    </p>
                                )}

                                {/* New Image Preview */}
                                {updateBrandData.brandImage && (
                                    <div className="mt-2 p-3 border border-green-200 rounded-lg bg-green-50">
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-600">✓</span>
                                            <span className="text-green-700 text-sm">
                        Ảnh mới đã được chọn: {updateBrandData.brandImage.name}
                      </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Help Text */}
                            <p className="text-xs text-gray-500 mt-2">
                                {currentImage && !imageToDelete
                                    ? "Chọn ảnh mới để thay thế, hoặc nhấn 'Xóa ảnh này' để xóa ảnh hiện tại"
                                    : "Chọn ảnh mới cho thương hiệu"
                                }
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateBrand}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Status Change Modal */}
            <Modals
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Xác nhận thay đổi trạng thái"
                size="sm"
            >
                {selectedBrand && (
                    <div>
                        <p className="text-gray-700 mb-6">
                            {selectedBrand.isActive
                                ? `Bạn muốn ngừng bán thương hiệu "${selectedBrand.brandName}" không?`
                                : `Bạn muốn kích hoạt lại thương hiệu "${selectedBrand.brandName}" không?`
                            }
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleStatusChange}
                                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                                    selectedBrand.isActive
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {selectedBrand.isActive ? 'Ngừng bán' : 'Kích hoạt'}
                            </button>
                        </div>
                    </div>
                )}
            </Modals>
        </div>
    );
};

export default BrandTable;
