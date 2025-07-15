// src/utils/constants/ProductConstants.js

// Product Status Options
export const PRODUCT_STATUS_OPTIONS = [
    { value: true, label: 'Đang bán', color: 'green' },
    { value: false, label: 'Đã ngừng bán', color: 'red' }
];

// Size Options
export const PRODUCT_SIZE_OPTIONS = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL',
    'SIZE_36', 'SIZE_37', 'SIZE_38', 'SIZE_39', 'SIZE_40',
    'SIZE_41', 'SIZE_42', 'SIZE_43', 'SIZE_44', 'SIZE_45'
];

// Helper Functions
export const PRODUCT_HELPERS = {
    getStatusText: (isActive) => {
        return isActive ? 'Đang bán' : 'Đã ngừng bán';
    },

    getStatusColorClass: (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    },

    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatPrice: (price) => {
        if (!price) return '0';
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    parsePrice: (priceString) => {
        if (!priceString) return 0;
        return parseInt(priceString.replace(/\./g, ''));
    },

    getUsername: (userObject) => {
        if (!userObject) return '';
        return userObject.username || userObject.email || '';
    },

    hasImages: (product) => {
        return product.images && Array.isArray(product.images) && product.images.length > 0;
    },

    getFirstImageUrl: (product) => {
        if (PRODUCT_HELPERS.hasImages(product)) {
            return product.images[0].imageUrl;
        }
        return null;
    },

    getTotalQuantity: (productVariants) => {
        if (!productVariants || !Array.isArray(productVariants)) return 0;
        return productVariants.reduce((total, variant) => total + (variant.quantity || 0), 0);
    },

    validateProductData: (productData) => {
        const errors = [];

        if (!productData.productName || productData.productName.trim() === '') {
            errors.push('Tên sản phẩm không được để trống');
        }

        if (!productData.unitPrice || productData.unitPrice <= 0) {
            errors.push('Giá sản phẩm phải lớn hơn 0');
        }

        if (!productData.brandId) {
            errors.push('Vui lòng chọn thương hiệu');
        }

        if (!productData.categoryId) {
            errors.push('Vui lòng chọn danh mục');
        }

        if (!productData.productVariants || productData.productVariants.length === 0) {
            errors.push('Sản phẩm phải có ít nhất một biến thể');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Default values
export const PRODUCT_DEFAULTS = {
    NEW_PRODUCT: {
        productName: '',
        productDescription: '',
        unitPrice: '',
        brandId: '',
        categoryId: '',
        productVariants: [],
        productImages: []
    },

    NEW_VARIANT: {
        color: '',
        productSize: '',
        quantity: 0
    }
};

// Sort Options
export const PRODUCT_SORT_OPTIONS = [
    { key: 'productName', label: 'Tên sản phẩm', type: 'string' },
    { key: 'productId', label: 'ID sản phẩm', type: 'number' },
    { key: 'unitPrice', label: 'Giá bán', type: 'number' },
    { key: 'createdAt', label: 'Ngày tạo', type: 'date' }
];

// Error Messages
export const PRODUCT_ERROR_MESSAGES = {
    PRODUCT_NAME_REQUIRED: 'Tên sản phẩm không được để trống',
    PRICE_REQUIRED: 'Giá sản phẩm không được để trống',
    BRAND_REQUIRED: 'Vui lòng chọn thương hiệu',
    CATEGORY_REQUIRED: 'Vui lòng chọn danh mục',
    VARIANTS_REQUIRED: 'Sản phẩm phải có ít nhất một biến thể',
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra'
};
