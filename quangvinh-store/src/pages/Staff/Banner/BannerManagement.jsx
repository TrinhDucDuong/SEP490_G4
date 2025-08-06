// src/pages/Staff/Banner/BannerManagement.jsx
import React, { useState } from 'react';
import { Save, RotateCcw, Upload, X } from 'lucide-react';
import BannerCard from './BannerCard';
import BannerFilter from './BannerFilter';
import BannerPagination from './BannerPagination';
import Modals from '../../../components/common/Admin/Modals';
import { useBannerManagement } from '../../../hooks/useBannerManagement';
import { BANNER_HELPERS, BANNER_SUCCESS_MESSAGES, BANNER_ERROR_MESSAGES, BANNER_DEFAULTS } from '../../../utils/constants/BannerConstants';

const BannerManagement = () => {
    const {
        // Data
        paginatedBanners,
        loading,
        error,

        // Pagination
        currentPage,
        setCurrentPage,
        totalPages,

        // Filter
        filters,
        handleFilterChange,
        clearFilters,

        // Status changes
        toggleBannerStatus,
        resetStatusChanges,
        hasPendingChanges,

        // Actions
        createBanner,
        updateBannerStatus,

        // Utilities
        getStatistics
    } = useBannerManagement();

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState(Array(6).fill(null)); // 6 slots

    // Image validation states
    const [imageValidation, setImageValidation] = useState({
        show: false,
        message: ''
    });

    const statistics = getStatistics();

    // Handle file selection for specific slot
    const handleFileSelect = (event, slotIndex) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate single file
        const validation = BANNER_HELPERS.validateBannerImages([file]);
        if (!validation.isValid) {
            setImageValidation({
                show: true,
                message: validation.errors.join(', ')
            });
            return;
        }

        setSelectedImages(prev => {
            const newImages = [...prev];
            newImages[slotIndex] = file;
            return newImages;
        });
        setImageValidation({ show: false, message: '' });
    };

    // Remove image from specific slot
    const removeImage = (slotIndex) => {
        setSelectedImages(prev => {
            const newImages = [...prev];
            newImages[slotIndex] = null;
            return newImages;
        });
    };

    // Handle create banner
    const handleCreateBanner = async () => {
        const validImages = selectedImages.filter(img => img !== null);

        if (validImages.length === 0) {
            setImageValidation({
                show: true,
                message: BANNER_ERROR_MESSAGES.NO_IMAGES_SELECTED
            });
            return;
        }

        const result = await createBanner(validImages);

        if (result.success) {
            setShowCreateModal(false);
            setSelectedImages(Array(6).fill(null));
            setImageValidation({ show: false, message: '' });
            // THÔNG BÁO VỀ BANNER MỚI Ở TRANG 1
            alert(`${BANNER_SUCCESS_MESSAGES.CREATE_SUCCESS}`);
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    // Handle update status
    const handleUpdateStatus = async () => {
        const result = await updateBannerStatus();

        if (result.success) {
            setShowConfirmModal(false);
            alert(BANNER_SUCCESS_MESSAGES.UPDATE_SUCCESS);
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    // Handle cancel create
    const handleCancelCreate = () => {
        setShowCreateModal(false);
        setSelectedImages(Array(6).fill(null));
        setImageValidation({ show: false, message: '' });
    };

    // Handle reset changes
    const handleResetChanges = () => {
        resetStatusChanges();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-red-800 font-semibold">Có lỗi xảy ra</h3>
                        <p className="text-red-600 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quản lý Banner
                    </h1>
                    <p className="text-gray-600">
                        Quản lý các banner hiển thị trên trang chủ
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng Banner</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.totalBanners}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <div className="h-6 w-6 bg-blue-600 rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                                <p className="text-2xl font-bold text-green-600">{statistics.activeBanners}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">O</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đã tạm dừng</p>
                                <p className="text-2xl font-bold text-red-600">{statistics.inactiveBanners}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">X</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Kết quả lọc</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.filteredCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter with Create Button */}
                <BannerFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    onCreateNew={() => setShowCreateModal(true)}
                />

                {/* HIỂN THỊ THÔNG TIN TRANG HIỆN TẠI */}
                {totalPages > 1 && (
                    <div className="mb-4 text-sm text-gray-600">
                        Đang xem trang {currentPage} / {totalPages}
                        {hasPendingChanges && (
                            <span className="ml-2 text-orange-600 font-medium">
                                (Có thay đổi chưa lưu ở trang này)
                            </span>
                        )}
                    </div>
                )}

                {/* Banner Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : paginatedBanners.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {paginatedBanners.map(banner => (
                                <BannerCard
                                    key={banner.imageId}
                                    banner={banner}
                                    onStatusToggle={toggleBannerStatus}
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <BannerPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={9}
                            totalItems={statistics.filteredCount}
                        />

                        {/* Save/Cancel buttons DƯỚI pagination - CHỈ HIỆN KHI CÓ THAY ĐỔI */}
                        {hasPendingChanges && (
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleResetChanges}
                                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Quay lại
                                </button>
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                                >
                                    <Save className="h-4 w-4" />
                                    Lưu
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có banner nào</h3>
                        <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm banner đầu tiên</p>
                    </div>
                )}

                {/* Create Banner Modal */}
                <Modals
                    isOpen={showCreateModal}
                    onClose={handleCancelCreate}
                    title="Thêm Banner Mới"
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                                <strong>Hướng dẫn:</strong> Bạn có thể upload tối đa 6 ảnh banner. Nhấn vào từng ô để chọn ảnh tương ứng. Banner mới sẽ được hiển thị đầu tiên trong danh sách.
                            </p>
                        </div>

                        {/* Image Upload Grid - 6 slots */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="aspect-video">
                                    {selectedImages[index] ? (
                                        // Show selected image
                                        <div className="relative w-full h-full group">
                                            <img
                                                src={URL.createObjectURL(selectedImages[index])}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                                {(selectedImages[index].size / 1024 / 1024).toFixed(1)}MB
                                            </div>
                                        </div>
                                    ) : (
                                        // Show upload placeholder
                                        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 transition-colors duration-200 cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect(e, index)}
                                                className="hidden"
                                                id={`banner-upload-${index}`}
                                            />
                                            <label
                                                htmlFor={`banner-upload-${index}`}
                                                className="cursor-pointer flex flex-col items-center gap-2 p-4 text-center"
                                            >
                                                <Upload className="h-6 w-6 text-gray-400" />
                                                <span className="text-xs text-gray-600">
                                                    Ảnh {index + 1}
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* File Info */}
                        <div className="text-center text-sm text-gray-500">
                            Hỗ trợ: JPG, PNG, GIF, WebP (Tối đa 5MB mỗi ảnh)
                        </div>

                        {/* Validation Error */}
                        {imageValidation.show && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-600 text-sm">{imageValidation.message}</p>
                            </div>
                        )}

                        {/* Modal Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={handleCancelCreate}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateBanner}
                                disabled={loading || selectedImages.every(img => img === null)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang tạo...' : 'Tạo Banner'}
                            </button>
                        </div>
                    </div>
                </Modals>

                {/* Confirmation Modal */}
                <Modals
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    title="Xác nhận cập nhật"
                    size="md"
                >
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Bạn có muốn cập nhật trạng thái mới cho Banner không?
                        </p>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                            >
                                Quay Lại
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang cập nhật...' : 'Lưu'}
                            </button>
                        </div>
                    </div>
                </Modals>
            </div>
        </div>
    );
};

export default BannerManagement;
