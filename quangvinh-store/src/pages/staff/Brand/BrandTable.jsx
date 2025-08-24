import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, Image, FileText, Users } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import DataTable from '../../../components/common/admin/DataTable';
import Modals from '../../../components/common/admin/Modals';
import Paginations from '../../../components/common/admin/Paginations';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BRAND_HELPERS, BRAND_DEFAULTS } from '../../../utils/constants/BrandConstants';
import SingleImageUpload from '../../../components/common/admin/SingleImageUpload';

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
    const { showSuccess, showError } = useToast();
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

    // States cho SingleImageUpload - Create Mode
    const [createImageFile, setCreateImageFile] = useState(null);
    const [createImageError, setCreateImageError] = useState('');

    // States cho SingleImageUpload - Update Mode
    const [updateImageFile, setUpdateImageFile] = useState(null);
    const [updateImageError, setUpdateImageError] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState(null);

    // Modal handlers
    const openCreateModal = () => {
        setNewBrand(BRAND_DEFAULTS.NEW_BRAND);
        setCreateImageFile(null);
        setCreateImageError('');
        setShowCreateModal(true);
    };

    const openUpdateModal = (brand) => {
        setUpdateBrandData({
            brandId: brand.brandId,
            brandName: brand.brandName,
            brandDescription: brand.brandDescription
        });

        setCurrentImageUrl(BRAND_HELPERS.hasImages(brand) ? BRAND_HELPERS.getFirstImageUrl(brand) : null);

        setUpdateImageFile(null);
        setUpdateImageError('');

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
            showError('Vui lòng nhập tên thương hiệu');
            return;
        }

        if (!createImageFile) {
            setCreateImageError('Vui lòng tải lên ảnh thương hiệu');
            showError('Vui lòng tải lên ảnh thương hiệu');
            return;
        }

        setCreateImageError('');

        const result = await onCreateBrand(newBrand, createImageFile);

        if (result.success) {
            setShowCreateModal(false);
            setNewBrand(BRAND_DEFAULTS.NEW_BRAND);
            setCreateImageFile(null);
            setCreateImageError('');

            // Show success toast
            showSuccess('Tạo thương hiệu thành công!');
        } else {
            // Show error toast
            showError(result.error || 'Có lỗi xảy ra khi tạo thương hiệu');
        }
    };

    const handleUpdateBrand = async () => {
        if (!updateBrandData.brandName.trim()) {
            showError('Vui lòng nhập tên thương hiệu');
            return;
        }

        let imageToSend = null;

        if (updateImageFile) {
            imageToSend = updateImageFile;
        } else if (currentImageUrl) {
            imageToSend = 'keep_existing';
        } else {
            setUpdateImageError('Vui lòng tải lên ảnh thương hiệu');
            showError('Vui lòng tải lên ảnh thương hiệu');
            return;
        }

        setUpdateImageError('');

        const result = await onUpdateBrand(
            updateBrandData.brandId,
            updateBrandData,
            imageToSend
        );

        if (result.success) {
            setShowUpdateModal(false);
            setUpdateBrandData(null);
            setCurrentImageUrl(null);
            setUpdateImageFile(null);
            setUpdateImageError('');
            showSuccess('Cập nhật thương hiệu thành công!');
        } else {
            showError(result.error || 'Có lỗi xảy ra khi cập nhật thương hiệu');
        }
    };

    const handleStatusChange = async () => {
        if (!selectedBrand) return;

        const result = await onDeleteBrand(selectedBrand.brandId);
        if (result.success) {
            setShowStatusModal(false);
            setSelectedBrand(null);
            const statusText = selectedBrand.isActive ? 'ngừng bán' : 'kích hoạt lại';
            showSuccess(`Đã ${statusText} thương hiệu "${selectedBrand.brandName}" thành công!`);
        } else {
            showError(result.error || 'Có lỗi xảy ra khi thay đổi trạng thái');
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
            header: 'Lịch sử chỉnh sửa',
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
                        {/* Header */}
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

            {/* Create Modal - validation message */}
            <Modals
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Thêm thương hiệu mới"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên thương hiệu *
                        </label>
                        <input
                            type="text"
                            value={newBrand.brandName}
                            onChange={(e) => setNewBrand(prev => ({ ...prev, brandName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên thương hiệu"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả thương hiệu
                        </label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={newBrand.brandDescription}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewBrand(prev => ({ ...prev, brandDescription: data }));
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Hình ảnh thương hiệu *
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
                            onClick={handleCreateBrand}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
            >
                {updateBrandData && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên thương hiệu *
                            </label>
                            <input
                                type="text"
                                value={updateBrandData.brandName}
                                onChange={(e) => setUpdateBrandData(prev => ({ ...prev, brandName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tên thương hiệu"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả thương hiệu
                            </label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={updateBrandData.brandDescription}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setUpdateBrandData(prev => ({ ...prev, brandDescription: data }));
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Hình ảnh thương hiệu *
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
                                onClick={handleUpdateBrand}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Cập nhật thương hiệu
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
