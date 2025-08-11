// src/pages/Staff/Product/ProductViewModal.jsx
import React, { useState } from 'react';
import { X, Package, Calendar, User, Store, Clock, Phone, MapPin } from 'lucide-react';
import { PRODUCT_HELPERS } from '../../../utils/constants/ProductConstants';

const ProductViewModal = ({
                              isOpen,
                              onClose,
                              product,
                              colors,
                              brands,
                              categories
                          }) => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

    if (!isOpen || !product) return null;

    // SỬ DỤNG colors parameter để mapping màu sắc từ API
    const getColorInfo = (colorValue) => {
        if (!colorValue || !colors || !Array.isArray(colors)) {
            return { hex: colorValue || '#000000', name: colorValue || 'Unknown' };
        }

        // Tìm màu từ API colors dựa trên hex hoặc name
        const colorFromAPI = colors.find(c =>
            c.colorHex === colorValue ||
            c.colorName === colorValue ||
            (typeof colorValue === 'object' && colorValue.colorHex === c.colorHex)
        );

        if (colorFromAPI) {
            return { hex: colorFromAPI.colorHex, name: colorFromAPI.colorName };
        }

        // Fallback nếu không tìm thấy trong API
        if (typeof colorValue === 'object' && colorValue.colorHex) {
            return { hex: colorValue.colorHex, name: colorValue.colorHex };
        }

        return { hex: colorValue || '#000000', name: colorValue || 'Unknown' };
    };

    // Handle store modal
    const handleStoreClick = (store, variant) => {
        console.log('Store button clicked:', store);
        setSelectedStore({ ...store, variant });
        setIsStoreModalOpen(true);
    };

    const closeStoreModal = () => {
        setIsStoreModalOpen(false);
        setSelectedStore(null);
    };

    // Format working hours
    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5); // "08:00:00" -> "08:00"
    };

    return (
        <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                    {/* Header */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900">Chi tiết sản phẩm</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mt-6 space-y-6">
                        {/* Basic Info Only - BỎ hình ảnh và mô tả */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                    {product.productName}
                                </h4>
                                <p className="text-2xl font-bold text-blue-600">
                                    {PRODUCT_HELPERS.formatPrice(product.unitPrice)}đ
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Thương hiệu:</span>
                                    <p className="text-gray-600 mt-1">
                                        {product.brand?.brandName || 'Chưa có thông tin'}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Danh mục:</span>
                                    <p className="text-gray-600 mt-1">
                                        {product.category?.categoryName || 'Chưa có thông tin'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product Variants */}
                        <div>
                            <h5 className="font-medium text-gray-700 mb-3">Biến thể sản phẩm</h5>
                            {product.productVariants && product.productVariants.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Màu sắc
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Kích thước
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Số lượng
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Cửa hàng
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {product.productVariants.map((variant, index) => {
                                            const colorInfo = getColorInfo(variant.color);
                                            return (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        {variant.color ? (
                                                            <div className="flex items-center">
                                                                <div
                                                                    className="w-6 h-6 rounded-full border-2 border-gray-300 mr-2"
                                                                    style={{ backgroundColor: colorInfo.hex }}
                                                                ></div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {colorInfo.name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {colorInfo.hex}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {variant.productSize || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {variant.quantity || 0}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {variant.stores && variant.stores.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {variant.stores.map((store, storeIndex) => (
                                                                    <button
                                                                        key={storeIndex}
                                                                        onClick={() => handleStoreClick(store, variant)}
                                                                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                                                                    >
                                                                        <Store className="w-3 h-3 mr-1" />
                                                                        Thông tin cửa hàng
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">Không có</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="2" className="px-4 py-3 text-sm font-medium text-gray-700">
                                                Tổng số lượng:
                                            </td>
                                            <td colSpan="2" className="px-4 py-3 text-sm font-bold text-gray-900">
                                                {PRODUCT_HELPERS.getTotalQuantity(product.productVariants)}
                                            </td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    Không có biến thể nào
                                </div>
                            )}
                        </div>

                        {/* Audit Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="font-medium mr-2">Ngày tạo:</span>
                                    {PRODUCT_HELPERS.formatDate(product.createdAt)}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <User className="w-4 h-4 mr-2" />
                                    <span className="font-medium mr-2">Người tạo:</span>
                                    {PRODUCT_HELPERS.getUsername(product.createdBy)}
                                    {product.createdBy?.email && (
                                        <span className="text-gray-400 ml-1">
                                            ({product.createdBy.email})
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="font-medium mr-2">Ngày cập nhật:</span>
                                    {PRODUCT_HELPERS.formatDate(product.updatedAt)}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <User className="w-4 h-4 mr-2" />
                                    <span className="font-medium mr-2">Người cập nhật:</span>
                                    {PRODUCT_HELPERS.getUsername(product.updatedBy)}
                                    {product.updatedBy?.email && (
                                        <span className="text-gray-400 ml-1">
                                            ({product.updatedBy.email})
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>

            {/* Store Info Modal - SỬA z-index */}
            {isStoreModalOpen && selectedStore && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60]">
                    <div className="relative top-32 mx-auto p-5 border w-11/12 max-w-lg shadow-lg rounded-md bg-white">
                        {/* Header */}
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Sản phẩm {product.productName} ở cửa hàng {selectedStore.storeName}
                            </h3>
                            <button
                                onClick={closeStoreModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Store Info */}
                        <div className="mt-4 space-y-4">
                            <div className="flex items-start">
                                <Store className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{selectedStore.storeName}</p>
                                    <p className="text-sm text-gray-500">Tên cửa hàng</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-900">{selectedStore.storeAddress}</p>
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-900">{selectedStore.storePhone}</p>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-gray-900">
                                        {formatTime(selectedStore.startWorkingAt)} - {formatTime(selectedStore.endWorkingAt)}
                                    </p>
                                    <p className="text-sm text-gray-500">Giờ làm việc</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={closeStoreModal}
                                className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductViewModal;
