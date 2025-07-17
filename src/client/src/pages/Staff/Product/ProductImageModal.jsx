// src/pages/Staff/Product/ProductImageModal.jsx

import React, { useState } from 'react';
import { X, ImageIcon, ZoomIn } from 'lucide-react';
import { PRODUCT_HELPERS } from '../../../utils/constants/ProductConstants';

const ProductImageModal = ({ isOpen, onClose, product }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen || !product) return null;

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeFullImage = () => {
        setSelectedImage(null);
    };

    const handleMainModalClose = () => {
        setSelectedImage(null);
        onClose();
    };

    return (
        <>
            {/* Main Image Gallery Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Hình ảnh sản phẩm - {product.productName}
                        </h2>
                        <button
                            onClick={handleMainModalClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {PRODUCT_HELPERS.hasImages(product) ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {product.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div
                                            className="aspect-square rounded-lg overflow-hidden bg-gray-100 border cursor-pointer hover:shadow-lg transition-shadow"
                                            onClick={() => handleImageClick(image.imageUrl)}
                                        >
                                            <img
                                                src={image.imageUrl}
                                                alt={`${product.productName} ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="hidden w-full h-full items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400" />
                                            </div>
                                        </div>
                                        {/* Zoom overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center pointer-events-none">
                                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Sản phẩm này chưa có hình ảnh</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={handleMainModalClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Image Modal - SỬA: Tăng z-index và fix event handling */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[60] p-4"
                    onClick={closeFullImage}
                >
                    <div className="relative max-w-full max-h-full flex items-center justify-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeFullImage();
                            }}
                            className="absolute top-4 right-4 p-3 bg-black bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size"
                            className="max-w-full max-h-full object-contain rounded-lg"
                            style={{ maxHeight: '90vh', maxWidth: '90vw' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductImageModal;
