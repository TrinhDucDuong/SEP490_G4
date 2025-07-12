// src/pages/Staff/Product/ProductModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, ImageIcon } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PRODUCT_DEFAULTS, PRODUCT_SIZE_OPTIONS, PRODUCT_HELPERS } from '../../../utils/constants/ProductConstants';

const ProductModal = ({
                          isOpen,
                          onClose,
                          onSubmit,
                          colors,
                          brands,
                          categories,
                          mode = 'create',
                          initialData = null
                      }) => {
    const [formData, setFormData] = useState(PRODUCT_DEFAULTS.NEW_PRODUCT);
    const [productImages, setProductImages] = useState([null, null, null, null, null, null]);
    const [previewImages, setPreviewImages] = useState([null, null, null, null, null, null]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Initialize form data
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            console.log('🔧 Edit mode - Initial data:', initialData);
            console.log('🏷️ Available brands for edit:', brands);
            console.log('📂 Available categories for edit:', categories);

            setFormData({
                productName: initialData.productName || '',
                productDescription: initialData.productDescription || '',
                unitPrice: initialData.unitPrice ? PRODUCT_HELPERS.formatPrice(initialData.unitPrice) : '',
                brandId: initialData.brandId || '',
                categoryId: initialData.categoryId || '',
                productVariants: initialData.productVariants || []
            });

            console.log('🔧 Form data set:', {
                brandId: initialData.brandId,
                categoryId: initialData.categoryId
            });

            // Set existing images for preview
            const newPreviewImages = [null, null, null, null, null, null];
            if (initialData.images && initialData.images.length > 0) {
                initialData.images.forEach((img, index) => {
                    if (index < 6) {
                        newPreviewImages[index] = {
                            url: img.imageUrl,
                            isExisting: true
                        };
                    }
                });
            }
            setPreviewImages(newPreviewImages);
            setProductImages([null, null, null, null, null, null]);
        } else {
            setFormData(PRODUCT_DEFAULTS.NEW_PRODUCT);
            setPreviewImages([null, null, null, null, null, null]);
            setProductImages([null, null, null, null, null, null]);
        }
        setErrors({});
    }, [mode, initialData, isOpen, brands, categories]);

    // Handle form input changes
    const handleInputChange = (field, value) => {
        if (field === 'unitPrice') {
            // SỬA LỖI: Xử lý input giá bán để tránh lỗi với bàn phím tiếng Việt
            let numericValue = value.replace(/[^\d]/g, ''); // Chỉ giữ lại số

            // Format với dấu chấm
            if (numericValue) {
                const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                setFormData(prev => ({
                    ...prev,
                    [field]: formattedValue
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [field]: ''
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Handle individual image upload
    const handleImageUpload = (index, file) => {
        if (file && file.type.startsWith('image/')) {
            const newProductImages = [...productImages];
            const newPreviewImages = [...previewImages];

            newProductImages[index] = file;

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviewImages[index] = {
                    url: e.target.result,
                    isExisting: false,
                    file: file
                };
                setPreviewImages(newPreviewImages);
            };
            reader.readAsDataURL(file);

            setProductImages(newProductImages);
        }
    };

    // Remove image
    const removeImage = (index) => {
        const newProductImages = [...productImages];
        const newPreviewImages = [...previewImages];

        newProductImages[index] = null;
        newPreviewImages[index] = null;

        setProductImages(newProductImages);
        setPreviewImages(newPreviewImages);
    };

    // Handle variant changes
    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            productVariants: [...prev.productVariants, { ...PRODUCT_DEFAULTS.NEW_VARIANT }]
        }));
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            productVariants: prev.productVariants.filter((_, i) => i !== index)
        }));
    };

    const updateVariant = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            productVariants: prev.productVariants.map((variant, i) =>
                i === index ? { ...variant, [field]: value } : variant
            )
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Parse price back to number
        const parsedFormData = {
            ...formData,
            unitPrice: PRODUCT_HELPERS.parsePrice(formData.unitPrice)
        };

        // Validate form
        const validation = PRODUCT_HELPERS.validateProductData(parsedFormData);
        if (!validation.isValid) {
            const errorObj = {};
            validation.errors.forEach(error => {
                if (error.includes('tên sản phẩm')) errorObj.productName = error;
                if (error.includes('giá')) errorObj.unitPrice = error;
                if (error.includes('thương hiệu')) errorObj.brandId = error;
                if (error.includes('danh mục')) errorObj.categoryId = error;
                if (error.includes('biến thể')) errorObj.variants = error;
            });
            setErrors(errorObj);
            return;
        }

        setLoading(true);
        try {
            // Filter out null images
            const validImages = productImages.filter(img => img !== null);

            let result;
            if (mode === 'create') {
                result = await onSubmit(parsedFormData, validImages);
            } else {
                result = await onSubmit(initialData.productId, parsedFormData, validImages);
            }

            if (result.success) {
                onClose();
                // Reset form
                setFormData(PRODUCT_DEFAULTS.NEW_PRODUCT);
                setProductImages([null, null, null, null, null, null]);
                setPreviewImages([null, null, null, null, null, null]);
                setErrors({});
            } else {
                setErrors({ submit: result.error || 'Có lỗi xảy ra' });
            }
        } catch (error) {
            setErrors({ submit: 'Có lỗi xảy ra khi xử lý yêu cầu' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên sản phẩm *
                                </label>
                                <input
                                    type="text"
                                    value={formData.productName}
                                    onChange={(e) => handleInputChange('productName', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.productName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập tên sản phẩm"
                                />
                                {errors.productName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá bán * (VNĐ)
                                </label>
                                <input
                                    type="text"
                                    value={formData.unitPrice}
                                    onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ví dụ: 1.000.000"
                                />
                                {errors.unitPrice && (
                                    <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thương hiệu *
                                </label>
                                <select
                                    value={formData.brandId}
                                    onChange={(e) => handleInputChange('brandId', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.brandId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map(brand => (
                                        <option key={brand.brandId} value={brand.brandId}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                                {errors.brandId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.brandId}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục *
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.categoryId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                                )}
                            </div>
                        </div>

                        {/* Description với CKEditor5 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả sản phẩm
                            </label>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={formData.productDescription}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        handleInputChange('productDescription', data);
                                    }}
                                    config={{
                                        toolbar: [
                                            'heading', '|',
                                            'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                                            'outdent', 'indent', '|',
                                            'blockQuote', 'insertTable', '|',
                                            'undo', 'redo'
                                        ],
                                        placeholder: 'Nhập mô tả sản phẩm...',
                                        height: 200
                                    }}
                                />
                            </div>
                        </div>

                        {/* Product Images - 6 Ô RIÊNG BIỆT */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hình ảnh sản phẩm (Tối đa 6 ảnh)
                            </label>
                            <p className="text-sm text-gray-500 mb-4">
                                Ảnh đầu tiên sẽ được hiển thị làm ảnh chính của sản phẩm
                            </p>

                            <div className="grid grid-cols-3 gap-4">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <div key={index} className="relative">
                                        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                            {previewImages[index] ? (
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={previewImages[index].url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    {index === 0 && (
                                                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                            Ảnh chính
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-gray-50">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-600 text-center">
                            Ảnh {index + 1}
                          </span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Variants */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Biến thể sản phẩm *
                                </label>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm biến thể
                                </button>
                            </div>

                            {formData.productVariants.length === 0 ? (
                                <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                                    Chưa có biến thể nào. Nhấp "Thêm biến thể" để bắt đầu.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.productVariants.map((variant, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-medium text-gray-900">Biến thể {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Màu sắc
                                                    </label>
                                                    <select
                                                        value={variant.color}
                                                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Chọn màu</option>
                                                        {colors.map(color => (
                                                            <option key={color.colorId} value={color.colorHex}>
                                                                {color.colorName} ({color.colorHex})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Kích thước
                                                    </label>
                                                    <select
                                                        value={variant.productSize}
                                                        onChange={(e) => updateVariant(index, 'productSize', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Chọn size</option>
                                                        {PRODUCT_SIZE_OPTIONS.map(size => (
                                                            <option key={size} value={size}>
                                                                {size}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Số lượng
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={variant.quantity}
                                                        onChange={(e) => updateVariant(index, 'quantity', parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        min="0"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.variants && (
                                <p className="mt-1 text-sm text-red-600">{errors.variants}</p>
                            )}
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-600">{errors.submit}</p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {mode === 'create' ? 'Tạo sản phẩm' : 'Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
