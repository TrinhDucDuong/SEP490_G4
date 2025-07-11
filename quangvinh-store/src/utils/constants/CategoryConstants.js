// src/utils/constants/CategoryConstants.js
export const CATEGORY_STATUS_OPTIONS = [
    { value: true, label: 'Đang bán', color: 'green' },
    { value: false, label: 'Ngừng bán', color: 'red' }
];

export const CATEGORY_HELPERS = {
    // Status helpers
    getStatusText: (isActive) => {
        return isActive ? 'Đang bán' : 'Ngừng bán';
    },

    getStatusColorClass: (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    },

    // Date helpers
    formatDate: (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    },

    // User helpers
    getUsername: (userObject) => {
        if (!userObject) return 'Unknown';
        return userObject.username || userObject.email || 'Unknown';
    },

    getUserEmail: (userObject) => {
        if (!userObject) return '';
        return userObject.email || '';
    },

    getAccountId: (userObject) => {
        if (!userObject) return null;
        return userObject.accountId || null;
    },

    // Image helpers
    hasImages: (category) => {
        return category &&
            category.images &&
            Array.isArray(category.images) &&
            category.images.length > 0;
    },

    getFirstImageUrl: (category) => {
        if (category &&
            category.images &&
            Array.isArray(category.images) &&
            category.images.length > 0) {
            return category.images[0].imageUrl;
        }
        return null;
    },

    // Update helpers
    hasBeenUpdated: (category) => {
        if (!category) return false;
        return category.updatedAt &&
            category.updatedBy &&
            category.updatedAt !== category.createdAt;
    },

    getLastUpdater: (category) => {
        if (!category) return null;

        if (category.updatedBy &&
            category.updatedAt &&
            category.updatedAt !== category.createdAt) {
            return {
                username: category.updatedBy.username || category.updatedBy.email || 'Unknown',
                email: category.updatedBy.email || '',
                accountId: category.updatedBy.accountId || null,
                timestamp: category.updatedAt
            };
        }

        return {
            username: category.createdBy?.username || category.createdBy?.email || 'Unknown',
            email: category.createdBy?.email || '',
            accountId: category.createdBy?.accountId || null,
            timestamp: category.createdAt
        };
    },

    // Editor history helpers
    getEditorsFromCategory: (category) => {
        if (!category) return [];

        const editors = [];
        let idCounter = 1;

        // Add creator
        if (category.createdBy) {
            editors.push({
                id: idCounter++,
                username: category.createdBy.username || category.createdBy.email || 'Unknown',
                email: category.createdBy.email || '',
                accountId: category.createdBy.accountId || null,
                action: 'Tạo danh mục',
                timestamp: category.createdAt,
                actionType: 'CREATE'
            });
        }

        // Add updater if different from creator
        if (category.updatedBy && category.updatedAt) {
            const updateTime = new Date(category.updatedAt);
            const createTime = new Date(category.createdAt);

            if (updateTime.getTime() !== createTime.getTime()) {
                editors.push({
                    id: idCounter++,
                    username: category.updatedBy.username || category.updatedBy.email || 'Unknown',
                    email: category.updatedBy.email || '',
                    accountId: category.updatedBy.accountId || null,
                    action: 'Cập nhật thông tin danh mục',
                    timestamp: category.updatedAt,
                    actionType: 'UPDATE'
                });

                // Add deactivation action if category is inactive
                if (!category.isActive) {
                    editors.push({
                        id: idCounter++,
                        username: category.updatedBy.username || category.updatedBy.email || 'Unknown',
                        email: category.updatedBy.email || '',
                        accountId: category.updatedBy.accountId || null,
                        action: 'Ngừng bán danh mục',
                        timestamp: category.updatedAt,
                        actionType: 'DEACTIVATE'
                    });
                }
            }
        }

        return editors.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },

    // Validation helpers
    validateCategoryData: (categoryData) => {
        const errors = [];

        if (!categoryData) {
            errors.push('Dữ liệu danh mục không hợp lệ');
            return { isValid: false, errors };
        }

        if (!categoryData.categoryName || categoryData.categoryName.trim() === '') {
            errors.push('Tên danh mục không được để trống');
        }

        if (categoryData.categoryName && categoryData.categoryName.length > 100) {
            errors.push('Tên danh mục không được vượt quá 100 ký tự');
        }

        if (categoryData.categoryName && categoryData.categoryName.length < 2) {
            errors.push('Tên danh mục phải có ít nhất 2 ký tự');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Category hierarchy helpers
    isParentCategory: (category) => {
        return category && !category.parentCategory;
    },

    isSubCategory: (category) => {
        return category && category.parentCategory;
    },

    getParentCategoryName: (category) => {
        if (!category || !category.parentCategory) return '';
        return category.parentCategory.categoryName || '';
    },

    getCategoryLevel: (category) => {
        if (!category) return 0;
        return category.parentCategory ? 1 : 0; // 0 for parent, 1 for sub
    },

    // Search helpers
    matchesSearchTerm: (category, searchTerm) => {
        if (!category || !searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        const categoryName = (category.categoryName || '').toLowerCase();
        const categoryId = (category.categoryId || '').toString();
        const parentCategoryName = (category.parentCategory?.categoryName || '').toLowerCase();
        const createdByUsername = CATEGORY_HELPERS.getUsername(category.createdBy).toLowerCase();
        const createdByEmail = CATEGORY_HELPERS.getUserEmail(category.createdBy).toLowerCase();

        return categoryName.includes(searchLower) ||
            categoryId.includes(searchLower) ||
            parentCategoryName.includes(searchLower) ||
            createdByUsername.includes(searchLower) ||
            createdByEmail.includes(searchLower);
    }
};

export const CATEGORY_DEFAULTS = {
    NEW_CATEGORY: {
        categoryName: '',
        parentCategoryId: null,
        categoryImage: null
    },

    DEFAULT_USER: {
        accountId: null,
        username: 'Unknown',
        email: '',
        isActive: null
    },

    DEFAULT_CATEGORY: {
        categoryId: null,
        categoryName: '',
        isActive: true,
        images: [],
        createdAt: null,
        createdBy: null,
        updatedBy: null,
        updatedAt: null,
        parentCategory: null,
        subCategories: []
    },

    EMPTY_FILTERS: {
        status: '',
        parentCategory: '',
        startDate: '',
        endDate: '',
        datePreset: ''
    },

    DEFAULT_SORT: {
        key: 'createdAt',
        direction: 'desc'
    }
};

export const CATEGORY_ACTION_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DEACTIVATE: 'DEACTIVATE',
    ACTIVATE: 'ACTIVATE',
    DELETE: 'DELETE'
};

export const CATEGORY_ACTION_LABELS = {
    [CATEGORY_ACTION_TYPES.CREATE]: 'Tạo danh mục',
    [CATEGORY_ACTION_TYPES.UPDATE]: 'Cập nhật thông tin',
    [CATEGORY_ACTION_TYPES.DEACTIVATE]: 'Ngừng bán danh mục',
    [CATEGORY_ACTION_TYPES.ACTIVATE]: 'Kích hoạt danh mục',
    [CATEGORY_ACTION_TYPES.DELETE]: 'Xóa danh mục'
};

export const CATEGORY_SORT_OPTIONS = [
    { key: 'categoryName', label: 'Tên danh mục', type: 'string' },
    { key: 'categoryId', label: 'ID danh mục', type: 'number' },
    { key: 'createdAt', label: 'Ngày tạo', type: 'date' },
    { key: 'updatedAt', label: 'Ngày cập nhật', type: 'date' },
    { key: 'parentCategoryName', label: 'Danh mục cha', type: 'string' },
    { key: 'status', label: 'Trạng thái', type: 'boolean' }
];

export const CATEGORY_FILTER_OPTIONS = {
    STATUS: CATEGORY_STATUS_OPTIONS,
    DATE_PRESETS: [
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: 'last7days', label: '7 ngày qua' },
        { value: 'last30days', label: '30 ngày qua' },
        { value: 'last3months', label: '3 tháng qua' },
        { value: 'last6months', label: '6 tháng qua' },
        { value: 'lastyear', label: 'Năm qua' },
        { value: 'custom', label: 'Tùy chỉnh' }
    ]
};

export const CATEGORY_ERROR_MESSAGES = {
    // Validation errors
    CATEGORY_NAME_REQUIRED: 'Tên danh mục không được để trống',
    CATEGORY_NAME_TOO_LONG: 'Tên danh mục không được vượt quá 100 ký tự',
    CATEGORY_NAME_TOO_SHORT: 'Tên danh mục phải có ít nhất 2 ký tự',
    INVALID_PARENT_CATEGORY: 'Danh mục cha không hợp lệ',

    // API errors
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    SERVER_ERROR: 'Lỗi từ phía server',
    UNAUTHORIZED: 'Bạn không có quyền thực hiện thao tác này',
    FORBIDDEN: 'Thao tác bị từ chối',
    NOT_FOUND: 'Không tìm thấy danh mục',
    CONFLICT: 'Danh mục đã tồn tại',

    // Generic errors
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra',
    INVALID_DATA: 'Dữ liệu không hợp lệ',
    OPERATION_FAILED: 'Thao tác thất bại'
};

export const CATEGORY_SUCCESS_MESSAGES = {
    CREATE_SUCCESS: 'Tạo danh mục thành công',
    UPDATE_SUCCESS: 'Cập nhật danh mục thành công',
    DELETE_SUCCESS: 'Xóa danh mục thành công',
    STATUS_CHANGE_SUCCESS: 'Thay đổi trạng thái thành công',
    FETCH_SUCCESS: 'Tải dữ liệu thành công'
};

export const CATEGORY_PERMISSIONS = {
    CREATE: 'category.create',
    READ: 'category.read',
    UPDATE: 'category.update',
    DELETE: 'category.delete',
    MANAGE: 'category.manage'
};

export const CATEGORY_LIMITS = {
    MAX_NAME_LENGTH: 100,
    MIN_NAME_LENGTH: 2,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    MAX_CATEGORIES_PER_PAGE: 50,
    DEFAULT_PAGE_SIZE: 10
};

export const CATEGORY_DISPLAY_MODES = {
    TABLE: 'table',
    GRID: 'grid',
    LIST: 'list'
};

export const CATEGORY_EXPORT_FORMATS = {
    CSV: 'csv',
    EXCEL: 'excel',
    PDF: 'pdf',
    JSON: 'json'
};

// Helper function to get error message by code
export const getCategoryErrorMessage = (errorCode) => {
    return CATEGORY_ERROR_MESSAGES[errorCode] || CATEGORY_ERROR_MESSAGES.UNKNOWN_ERROR;
};

// Helper function to get success message by code
export const getCategorySuccessMessage = (successCode) => {
    return CATEGORY_SUCCESS_MESSAGES[successCode] || 'Thao tác thành công';
};

// Helper function to validate image file
export const validateImageFile = (file) => {
    const errors = [];

    if (!file) {
        return { isValid: true, errors: [] }; // Image is optional
    }

    if (file.size > CATEGORY_LIMITS.MAX_IMAGE_SIZE) {
        errors.push(`Kích thước file không được vượt quá ${CATEGORY_LIMITS.MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
    }

    if (!CATEGORY_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errors.push('Chỉ chấp nhận file ảnh định dạng JPG, PNG, GIF, WebP');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Helper function to format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to generate category breadcrumb
export const getCategoryBreadcrumb = (category) => {
    if (!category) return [];

    const breadcrumb = [];

    if (category.parentCategory) {
        breadcrumb.push({
            id: category.parentCategory.categoryId,
            name: category.parentCategory.categoryName,
            isParent: true
        });
    }

    breadcrumb.push({
        id: category.categoryId,
        name: category.categoryName,
        isParent: false
    });

    return breadcrumb;
};
