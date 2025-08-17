// src/pages/staff/product/ProductModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PRODUCT_DEFAULTS, PRODUCT_SIZE_OPTIONS, PRODUCT_HELPERS } from '../../../utils/constants/ProductConstants';

const ProductModal = ({
                          isOpen,
                          onClose,
                          onSubmit,
                          brands,
                          categories,
                          colors = [],
                          mode = 'create',
                          initialData = null
                      }) => {
    const [formData, setFormData] = useState(PRODUCT_DEFAULTS.NEW_PRODUCT);
    const [productImages, setProductImages] = useState([null, null, null, null, null, null]);
    const [previewImages, setPreviewImages] = useState([null, null, null, null, null, null]);
    const [existingImageUrls, setExistingImageUrls] = useState([]); // FIXED: Thêm state cho existing URLs
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Hàm chuyển URL ảnh thành File (nếu backend chỉ nhận file)
    async function urlToFile(url, filename = 'image.jpg') {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    }

    // FIXED: Initialize form data với xử lý màu sắc hiện tại và existing image URLs
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            console.log('🔧 Edit mode - Initial data:', initialData);

            // Xử lý brandId từ nested object hoặc trực tiếp
            let brandId = '';
            if (initialData.brandId) {
                brandId = initialData.brandId;
            } else if (initialData.brand && initialData.brand.brandId) {
                brandId = initialData.brand.brandId;
            }

            // Xử lý categoryId từ nested object hoặc trực tiếp
            let categoryId = '';
            if (initialData.categoryId) {
                categoryId = initialData.categoryId;
            } else if (initialData.category && initialData.category.categoryId) {
                categoryId = initialData.category.categoryId;
            }

            // FIXED: Xử lý productVariants với màu sắc hiện tại
            let processedVariants = [];
            if (initialData.productVariants && initialData.productVariants.length > 0) {
                processedVariants = initialData.productVariants.map(variant => {
                    let colorHex = '#000000';

                    if (variant.color && variant.color.colorHex) {
                        colorHex = variant.color.colorHex;
                    } else if (variant.color && typeof variant.color === 'string') {
                        colorHex = variant.color;
                    } else if (variant.colorHex) {
                        colorHex = variant.colorHex;
                    }

                    return {
                        color: colorHex,
                        productSize: variant.productSize || '',
                        quantity: variant.quantity || 0
                    };
                });
            }

            setFormData({
                productName: initialData.productName || '',
                productDescription: initialData.productDescription || '',
                unitPrice: initialData.unitPrice ? PRODUCT_HELPERS.formatPrice(initialData.unitPrice) : '',
                brandId: brandId,
                categoryId: categoryId,
                productVariants: processedVariants
            });

            // FIXED: Set existing images for preview và lưu URLs
            const newPreviewImages = [null, null, null, null, null, null];
            const imageUrls = [];

            if (initialData.images && initialData.images.length > 0) {
                initialData.images.forEach((img, index) => {
                    if (index < 6) {
                        newPreviewImages[index] = {
                            url: img.imageUrl,
                            isExisting: true
                        };
                        imageUrls.push(img.imageUrl);
                    }
                });
            }

            setPreviewImages(newPreviewImages);
            setExistingImageUrls(imageUrls); // FIXED: Lưu existing URLs
            setProductImages([null, null, null, null, null, null]);

            console.log('📷 Existing image URLs saved:', imageUrls);
        } else {
            // Reset form cho CREATE mode
            setFormData(PRODUCT_DEFAULTS.NEW_PRODUCT);
            setPreviewImages([null, null, null, null, null, null]);
            setProductImages([null, null, null, null, null, null]);
            setExistingImageUrls([]);
        }
        setErrors({});
    }, [mode, initialData, isOpen, brands, categories]);

    // Handle form input changes
    const handleInputChange = (field, value) => {
        if (field === 'unitPrice') {
            let numericValue = value.replace(/[^\d]/g, '');
            if (numericValue) {
                const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                setFormData(prev => ({ ...prev, [field]: formattedValue }));
            } else {
                setFormData(prev => ({ ...prev, [field]: '' }));
            }
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle individual image upload
    const handleImageUpload = (index, file) => {
        if (file && file.type.startsWith('image/')) {
            const newProductImages = [...productImages];
            const newPreviewImages = [...previewImages];

            newProductImages[index] = file;

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

    // FIXED: Handle form submission với existing image URLs
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('=== FORM SUBMISSION START ===');
        console.log('Mode:', mode);
        console.log('Raw form data:', formData);

        // Parse và validate dữ liệu đúng cách cho cả CREATE và UPDATE
        const parsedFormData = {
            ...formData,
            unitPrice: PRODUCT_HELPERS.parsePrice(formData.unitPrice),
            brandId: formData.brandId ? formData.brandId.toString() : '',
            categoryId: formData.categoryId ? formData.categoryId.toString() : ''
        };

        console.log('Parsed form data for', mode, ':', parsedFormData);

        // Validation tốt hơn
        const validationErrors = {};

        if (!parsedFormData.productName?.trim()) {
            validationErrors.productName = 'Tên sản phẩm không được để trống';
        }

        if (!parsedFormData.unitPrice || parsedFormData.unitPrice <= 0) {
            validationErrors.unitPrice = 'Giá sản phẩm phải lớn hơn 0';
        }

        if (!parsedFormData.brandId) {
            validationErrors.brandId = 'Vui lòng chọn thương hiệu';
        }

        if (!parsedFormData.categoryId) {
            validationErrors.categoryId = 'Vui lòng chọn danh mục';
        }

        if (!parsedFormData.productVariants || parsedFormData.productVariants.length === 0) {
            validationErrors.variants = 'Sản phẩm phải có ít nhất một biến thể';
        } else {
            // Validate từng variant
            parsedFormData.productVariants.forEach((variant, index) => {
                if (!variant.color?.trim()) {
                    validationErrors[`variant_color_${index}`] = 'Vui lòng chọn màu sắc';
                }
                if (!variant.productSize?.trim()) {
                    validationErrors[`variant_size_${index}`] = 'Vui lòng chọn kích thước';
                }
                if (variant.quantity === undefined || variant.quantity < 0) {
                    validationErrors[`variant_quantity_${index}`] = 'Số lượng phải >= 0';
                }
            });
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log('Validation errors:', validationErrors);
            return;
        }

        setLoading(true);
        try {
            // Xử lý logic gửi ảnh: chỉ gửi khi có ảnh mới trong UPDATE, luôn gửi trong CREATE

            let shouldSendImages = false;
            let imagesToSend = [];
            const hasNewImages = productImages.some(img => img instanceof File);

            if (mode === 'create') {
                imagesToSend = productImages.filter(img => img instanceof File);
            } else {
                if (hasNewImages) {
                    // Có ảnh mới, gửi ảnh mới
                    imagesToSend = productImages.filter(img => img instanceof File);
                } else {
                    // Không có ảnh mới, gửi lại ảnh hiện tại
                    // Nếu backend nhận URL: imagesToSend = existingImageUrls;
                    // Nếu backend chỉ nhận file:
                    imagesToSend = await Promise.all(
                        existingImageUrls.map(async (url, idx) => await urlToFile(url, `old_${idx}.jpg`))
                    );
                }
            }

            console.log('Submitting', mode, 'with data:', parsedFormData);
            console.log('Should send images:', shouldSendImages);
            console.log('Images to send:', imagesToSend.length);

            let result;
            if (mode === 'create') {
                result = await onSubmit(parsedFormData, imagesToSend);
            } else {
                result = await onSubmit(initialData.productId, parsedFormData, imagesToSend);
            }


            console.log('Submission result:', result);

            if (result.success) {
                console.log('Form submission successful');
                onClose();
                // Reset form
                setFormData(PRODUCT_DEFAULTS.NEW_PRODUCT);
                setProductImages([null, null, null, null, null, null]);
                setPreviewImages([null, null, null, null, null, null]);
                setErrors({});
            } else {
                console.log('Form submission failed:', result.error);
                setErrors({ submit: result.error || 'Có lỗi xảy ra' });
            }
        } catch (error) {
            console.error('Error in form submission:', error);
            setErrors({ submit: 'Có lỗi xảy ra khi xử lý yêu cầu' });
        } finally {
            setLoading(false);
            console.log('=== FORM SUBMISSION END ===');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {mode === 'edit' ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-6">
                            {/* product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.productName}
                                    onChange={(e) => handleInputChange('productName', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.productName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập tên sản phẩm"
                                />
                                {errors.productName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá sản phẩm (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.unitPrice}
                                    onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Nhập giá sản phẩm"
                                />
                                {errors.unitPrice && (
                                    <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>
                                )}
                            </div>

                            {/* Brand & Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thương hiệu <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.brandId}
                                        onChange={(e) => handleInputChange('brandId', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.brandId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {brands && brands.map(brand => (
                                            <option key={brand.brandId} value={brand.brandId}>
                                                {brand.brandName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.brandId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.categoryId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories && categories.map(category => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                                    )}
                                </div>
                            </div>

                            {/* product Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả sản phẩm
                                </label>
                                <div className="border border-gray-300 rounded-md">
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
                                                'bold', 'italic', 'link', '|',
                                                'bulletedList', 'numberedList', '|',
                                                'outdent', 'indent', '|',
                                                'blockQuote', 'insertTable', '|',
                                                'undo', 'redo'
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Images & Variants */}
                        <div className="space-y-6">
                            {/* product Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Hình ảnh sản phẩm (Tối đa 6 ảnh)
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {previewImages.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                                {preview ? (
                                                    <>
                                                        <img
                                                            src={preview.url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <label className="cursor-pointer flex flex-col items-center">
                                                        <Upload size={24} className="text-gray-400" />
                                                        <span className="text-xs text-gray-500 mt-1">Upload</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* product Variants */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Biến thể sản phẩm <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                                    >
                                        <Plus size={16} className="mr-1" />
                                        Thêm biến thể
                                    </button>
                                </div>

                                {errors.variants && (
                                    <p className="text-red-500 text-sm mb-3">{errors.variants}</p>
                                )}

                                <div className="space-y-4 max-h-80 overflow-y-auto">
                                    {formData.productVariants.map((variant, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                                {/* Màu sắc với color picker và dropdown */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Màu sắc
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="color"
                                                            value={variant.color || '#000000'}
                                                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                                            className="w-6 h-8 border border-gray-300 rounded cursor-pointer"
                                                            title="Chọn màu từ bảng màu"
                                                        />
                                                        <span className="text-gray-700">
                                                            Màu sắc đã chọn:
                                                        </span>
                                                        {variant.color && (
                                                            <div
                                                                className="w-4 h-8 border border-gray-300 rounded flex-shrink-0"
                                                                style={{ backgroundColor: variant.color }}
                                                                title={`Màu hiện tại: ${variant.color}`}
                                                            ></div>
                                                        )}
                                                    </div>
                                                    {errors[`variant_color_${index}`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`variant_color_${index}`]}</p>
                                                    )}
                                                </div>

                                                {/* Kích thước */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Kích thước
                                                    </label>
                                                    <select
                                                        value={variant.productSize}
                                                        onChange={(e) => updateVariant(index, 'productSize', e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                                            errors[`variant_size_${index}`] ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                    >
                                                        <option value="">Chọn size</option>
                                                        {PRODUCT_SIZE_OPTIONS.map(size => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                    {errors[`variant_size_${index}`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`variant_size_${index}`]}</p>
                                                    )}
                                                </div>

                                                {/* Số lượng */}
                                                <div className="md:col-span-1">
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Số lượng
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variant.quantity}
                                                        onChange={(e) => updateVariant(index, 'quantity', e.target.value)}
                                                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                                            errors[`variant_quantity_${index}`] ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                        placeholder="0"
                                                    />
                                                    {errors[`variant_quantity_${index}`] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors[`variant_quantity_${index}`]}</p>
                                                    )}
                                                </div>

                                                {/* Nút xóa */}
                                                <div className="md:col-span-1 flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(index)}
                                                        className="w-full px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex items-center justify-center"
                                                    >
                                                        <Trash2 size={14} className="mr-1" />
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.submit}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang xử lý...' : (mode === 'edit' ? 'Cập nhật' : 'Tạo mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
