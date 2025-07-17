// src/pages/Staff/Product/ProductViewModal.jsx

import React from 'react';
import { X, Package, Calendar, User } from 'lucide-react';
import { PRODUCT_HELPERS } from '../../../utils/constants/ProductConstants';

const ProductViewModal = ({
                              isOpen,
                              onClose,
                              product,
                              colors,
                              brands,
                              categories
                          }) => {
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Thông tin chi tiết - {product.productName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basic Info - BỎ BRAND VÀ CATEGORY */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-600">Tên sản phẩm:</span>
                                            <p className="font-medium text-lg">{product.productName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="w-5 h-5 text-center text-gray-400">₫</span>
                                        <div>
                                            <span className="text-sm text-gray-600">Giá bán:</span>
                                            <p className="font-medium text-xl text-green-600">
                                                {PRODUCT_HELPERS.formatPrice(product.unitPrice)}đ
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-gray-600">Trạng thái:</span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ml-2 ${PRODUCT_HELPERS.getStatusColorClass(product.isActive)}`}>
                      {PRODUCT_HELPERS.getStatusText(product.isActive)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Creation Info */}
                        <div className="space-y-6">
                            {/* Creation Info */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin tạo & cập nhật</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-600">Ngày tạo:</span>
                                            <p className="font-medium">{PRODUCT_HELPERS.formatDate(product.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-600">Người tạo:</span>
                                            <p className="font-medium">{PRODUCT_HELPERS.getUsername(product.createdBy)}</p>
                                            {product.createdBy?.email && (
                                                <p className="text-sm text-gray-500">{product.createdBy.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {product.updatedAt && product.updatedAt !== product.createdAt && (
                                        <>
                                            <div className="flex items-center gap-3 border-t pt-4">
                                                <Calendar className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                                                    <p className="font-medium">{PRODUCT_HELPERS.formatDate(product.updatedAt)}</p>
                                                </div>
                                            </div>

                                            {product.updatedBy && (
                                                <div className="flex items-center gap-3">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <span className="text-sm text-gray-600">Người cập nhật:</span>
                                                        <p className="font-medium">{PRODUCT_HELPERS.getUsername(product.updatedBy)}</p>
                                                        {product.updatedBy?.email && (
                                                            <p className="text-sm text-gray-500">{product.updatedBy.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Variants - SỬ DỤNG getColorInfo để mapping màu sắc */}
                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Biến thể sản phẩm</h3>

                        {product.productVariants && product.productVariants.length > 0 ? (
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Màu sắc
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kích thước
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Số lượng
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {product.productVariants.map((variant, index) => {
                                        // SỬ DỤNG getColorInfo để lấy thông tin màu từ API
                                        const colorInfo = getColorInfo(variant.color?.colorHex || variant.color);

                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {variant.color ? (
                                                        <div className="flex items-center space-x-3">
                                                            <div
                                                                className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                                                                style={{ backgroundColor: colorInfo.hex }}
                                                                title={`${colorInfo.name} (${colorInfo.hex})`}
                                                            />
                                                            <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    {colorInfo.name}
                                  </span>
                                                                <span className="text-xs text-gray-500">
                                    {colorInfo.hex}
                                  </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {variant.productSize || '-'}
                            </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {variant.quantity || 0}
                            </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            Tổng số lượng:
                                        </td>
                                        <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800">
                          {PRODUCT_HELPERS.getTotalQuantity(product.productVariants)}
                        </span>
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Không có biến thể nào</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductViewModal;
