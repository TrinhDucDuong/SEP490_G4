export const BANNER_STATUS_OPTIONS = [
    { value: true, label: 'Đang hoạt động', color: 'green' },
    { value: false, label: 'Đã tạm dừng', color: 'red' },
    { value: '', label: 'Tất cả', color: 'gray' }
];

// Helper Functions
export const BANNER_HELPERS = {
    getStatusText: (isActive) => {
        return isActive ? 'Đang hoạt động' : 'Đã tạm dừng';
    },

    getStatusColorClass: (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    },

    getStatusIcon: (isActive) => {
        return isActive ? 'O' : 'X';
    },

    getStatusButtonClass: (isActive) => {
        return isActive
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white';
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

    hasStatusChanges: (activeIds, deActiveIds) => {
        const hasActiveChanges = activeIds && activeIds.length > 0 && !activeIds.every(id => id === 0);
        const hasDeActiveChanges = deActiveIds && deActiveIds.length > 0 && !deActiveIds.every(id => id === 0);
        return hasActiveChanges || hasDeActiveChanges;
    },

    // Validate banner data
    validateBannerImages: (images) => {
        const errors = [];

        if (!images || images.length === 0) {
            errors.push('Vui lòng chọn ít nhất một ảnh banner');
        }

        if (images && images.length > 6) {
            errors.push('Chỉ được upload tối đa 6 ảnh mỗi lần');
        }

        images?.forEach((image, index) => {
            if (!image.type.startsWith('image/')) {
                errors.push(`File thứ ${index + 1} không phải là ảnh`);
            }

            if (image.size > 15 * 1024 * 1024) {
                errors.push(`Ảnh thứ ${index + 1} quá lớn (tối đa 15MB)`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Default values
export const BANNER_DEFAULTS = {
    NEW_BANNER_IMAGES: [],
    ITEMS_PER_PAGE: 9,
    MAX_UPLOAD_IMAGES: 6,
    DEFAULT_FILTER: {
        status: ''
    }
};

// Status Change Types
export const BANNER_STATUS_CHANGE_TYPES = {
    ACTIVATE: 'ACTIVATE',
    DEACTIVATE: 'DEACTIVATE'
};

// Action Labels
export const BANNER_ACTION_LABELS = {
    [BANNER_STATUS_CHANGE_TYPES.ACTIVATE]: 'Kích hoạt banner',
    [BANNER_STATUS_CHANGE_TYPES.DEACTIVATE]: 'Tạm dừng banner'
};

// filter Options
export const BANNER_FILTER_OPTIONS = {
    STATUS: BANNER_STATUS_OPTIONS
};

// API Response Status
export const API_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    LOADING: 'loading'
};

// Modal Sizes
export const MODAL_SIZES = {
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg',
    EXTRA_LARGE: 'xl'
};

// Validation Rules
export const BANNER_VALIDATION_RULES = {
    MAX_FILE_SIZE: 15 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    MAX_FILES_PER_UPLOAD: 6
};

// Error Messages
export const BANNER_ERROR_MESSAGES = {
    NO_IMAGES_SELECTED: 'Vui lòng chọn ít nhất một ảnh banner',
    FILE_TOO_LARGE: 'Kích thước file quá lớn (tối đa 15MB)',
    INVALID_FILE_TYPE: 'Loại file không hợp lệ. Chỉ chấp nhận ảnh',
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra',
    TOO_MANY_FILES: 'Chỉ được upload tối đa 6 ảnh mỗi lần' // UPDATED
};

// Success Messages
export const BANNER_SUCCESS_MESSAGES = {
    CREATE_SUCCESS: 'Tạo banner thành công!',
    UPDATE_SUCCESS: 'Cập nhật trạng thái banner thành công!',
    STATUS_CHANGE_SUCCESS: 'Thay đổi trạng thái thành công!'
};
