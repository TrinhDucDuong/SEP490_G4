// Product Color Options - Sync với database
export const PRODUCT_COLOR_OPTIONS = [
    { name: 'Đen', hex: '#000000' },
    { name: 'Trắng', hex: '#FFFFFF' },
    { name: 'Đỏ', hex: '#FF0000' },
    { name: 'Xanh dương', hex: '#0000FF' },
    { name: 'Vàng', hex: '#FFFF00' },
    { name: 'Xanh lá', hex: '#008000' },
    { name: 'Hồng', hex: '#FFC0CB' },
    { name: 'Tím', hex: '#800080' },
    { name: 'Cam', hex: '#FFA500' },
    { name: 'Nâu', hex: '#A52A2A' },
    { name: 'Xám', hex: '#808080' },
    { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'Vàng kim', hex: '#FFD700' },
    { name: 'Bạc', hex: '#C0C0C0' },
    { name: 'Xanh rừng', hex: '#228B22' },
    { name: 'Đỏ thẫm', hex: '#DC143C' },
    { name: 'Tím đậm', hex: '#4B0082' },
    { name: 'Vàng nhạt', hex: '#F0E68C' },
    { name: 'Cam đỏ', hex: '#FF4500' }
];

// Product Size Options - Sync với database
export const PRODUCT_SIZE_OPTIONS = [
    'S', 'M', 'L', 'XL', 'XXL', 'SIZE_42', 'SIZE_43'
];

// Product Status Options
export const PRODUCT_STATUS_OPTIONS = [
    { value: 'Đang bán', label: 'Đang bán', color: 'green' },
    { value: 'Đã ngừng bán', label: 'Đã ngừng bán', color: 'red' }
];

// Brand Options
export const PRODUCT_BRAND_OPTIONS = [
    'Nike', 'Adidas', 'Puma', 'Gucci', 'Chanel', 'Dior', 'Prada',
    'Supreme', 'Balenciaga', 'Louis Vuitton', 'Under Armour',
    'North Face', 'Burberry', 'Moncler', 'Levi\'s', 'Zara',
    'H&M', 'COS', 'Stussy', 'Patagonia', 'Forever 21', 'Other'
];

// Helper Functions
export const PRODUCT_HELPERS = {
    getColorName: (hex) => {
        const color = PRODUCT_COLOR_OPTIONS.find(c => c.hex === hex);
        return color ? color.name : hex;
    },

    isValidColor: (hex) => {
        return PRODUCT_COLOR_OPTIONS.some(c => c.hex === hex);
    },

    isValidSize: (size) => {
        return PRODUCT_SIZE_OPTIONS.includes(size);
    },

    getStatusColorClass: (status) => {
        const statusOption = PRODUCT_STATUS_OPTIONS.find(s => s.value === status);
        return statusOption ? `text-${statusOption.color}-600 bg-${statusOption.color}-100` : 'text-gray-600 bg-gray-100';
    },

    formatPrice: (price) => {
        if (!price) return '0';
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    parsePrice: (priceString) => {
        if (!priceString) return '';
        return priceString.replace(/\./g, '');
    }
};

// Default values
export const PRODUCT_DEFAULTS = {
    NEW_PRODUCT: {
        name: '',
        code: '',
        price: '',
        brand: '',
        brandId: null, // ✅ THÊM
        categoryId: null, // ✅ THÊM
        description: '',
        coverImage: null,
        productImages: [null, null, null, null, null, null],
        variants: []
    },

    NEW_VARIANT: {
        code: '',
        color: '',
        size: '',
        quantity: 0
    }
};
