export const BRAND_STATUS_OPTIONS = [
    { value: true, label: 'Đang bán', color: 'green' },
    { value: false, label: 'Đã ngừng bán', color: 'red' }
];

// Helper Functions
export const BRAND_HELPERS = {
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

    getUsername: (userObject) => {
        if (!userObject) return 'Unknown';
        return userObject.username || userObject.email || 'Unknown';
    },

    getUserEmail: (userObject) => {
        return userObject?.email || '';
    },

    getAccountId: (userObject) => {
        return userObject?.accountId || null;
    },

    hasImages: (brand) => {
        return brand.images && Array.isArray(brand.images) && brand.images.length > 0;
    },

    getFirstImageUrl: (brand) => {
        if (BRAND_HELPERS.hasImages(brand)) {
            return brand.images[0].imageUrl;
        }
        return null;
    },

    isSameUser: (user1, user2) => {
        if (!user1 || !user2) return false;
        return user1.accountId === user2.accountId;
    },

    getDisplayName: (userObject) => {
        if (!userObject) return 'Unknown';
        return userObject.username || userObject.email || 'Unknown';
    },

    hasBeenUpdated: (brand) => {
        return brand.updatedAt && brand.updatedBy &&
            brand.updatedAt !== brand.createdAt;
    },

    getLastUpdater: (brand) => {
        if (BRAND_HELPERS.hasBeenUpdated(brand)) {
            return {
                username: brand.updatedBy.username,
                email: brand.updatedBy.email,
                accountId: brand.updatedBy.accountId,
                timestamp: brand.updatedAt
            };
        }
        return {
            username: brand.createdBy?.username || 'Unknown',
            email: brand.createdBy?.email || '',
            accountId: brand.createdBy?.accountId || null,
            timestamp: brand.createdAt
        };
    },

    getEditorsFromBrand: (brand) => {
        const editors = [];
        let idCounter = 1;

        if (brand.createdBy) {
            editors.push({
                id: idCounter++,
                username: brand.createdBy.username || brand.createdBy.email || 'Unknown',
                email: brand.createdBy.email || '',
                accountId: brand.createdBy.accountId,
                action: 'Tạo thương hiệu',
                timestamp: brand.createdAt,
                actionType: 'CREATE'
            });
        }

        if (brand.updatedBy && brand.updatedAt) {
            const updateTime = new Date(brand.updatedAt);
            const createTime = new Date(brand.createdAt);

            if (updateTime.getTime() !== createTime.getTime()) {
                editors.push({
                    id: idCounter++,
                    username: brand.updatedBy.username || brand.updatedBy.email || 'Unknown',
                    email: brand.updatedBy.email || '',
                    accountId: brand.updatedBy.accountId,
                    action: 'Cập nhật thông tin thương hiệu',
                    timestamp: brand.updatedAt,
                    actionType: 'UPDATE'
                });

                if (!brand.isActive) {
                    editors.push({
                        id: idCounter++,
                        username: brand.updatedBy.username || brand.updatedBy.email || 'Unknown',
                        email: brand.updatedBy.email || '',
                        accountId: brand.updatedBy.accountId,
                        action: 'Ngừng bán thương hiệu',
                        timestamp: brand.updatedAt,
                        actionType: 'DEACTIVATE'
                    });
                }
            }
        }

        return editors.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },

    validateBrandData: (brandData) => {
        const errors = [];

        if (!brandData.brandName || brandData.brandName.trim() === '') {
            errors.push('Tên thương hiệu không được để trống');
        }

        if (brandData.brandName && brandData.brandName.length > 100) {
            errors.push('Tên thương hiệu không được vượt quá 100 ký tự');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    generateEditorId: (accountId, timestamp, actionType) => {
        return `${accountId}-${timestamp}-${actionType}`;
    },

    getActionText: (actionType) => {
        const actionMap = {
            'CREATE': 'Tạo thương hiệu',
            'UPDATE': 'Cập nhật thông tin',
            'DEACTIVATE': 'Ngừng bán thương hiệu',
            'ACTIVATE': 'Kích hoạt thương hiệu'
        };
        return actionMap[actionType] || 'Hành động không xác định';
    },

    parseAuditLog: (brand) => {
        if (brand.auditLog && Array.isArray(brand.auditLog)) {
            return brand.auditLog.map(log => ({
                id: log.id,
                username: log.username,
                email: log.email || '',
                accountId: log.accountId,
                action: log.actionDescription || BRAND_HELPERS.getActionText(log.action),
                timestamp: log.timestamp,
                actionType: log.action
            }));
        }

        return BRAND_HELPERS.getEditorsFromBrand(brand);
    },

    detectActionType: (brand, previousBrand = null) => {
        if (!previousBrand) {
            return 'CREATE';
        }

        if (brand.isActive !== previousBrand.isActive) {
            return brand.isActive ? 'ACTIVATE' : 'DEACTIVATE';
        }

        if (brand.brandName !== previousBrand.brandName ||
            brand.brandDescription !== previousBrand.brandDescription ||
            JSON.stringify(brand.images) !== JSON.stringify(previousBrand.images)) {
            return 'UPDATE';
        }

        return 'UPDATE';
    }
};

// Default values
export const BRAND_DEFAULTS = {
    NEW_BRAND: {
        brandName: '',
        brandDescription: '',
        brandImage: null
    },

    // Default user object structure
    DEFAULT_USER: {
        accountId: null,
        username: 'Unknown',
        email: '',
        isActive: null
    },

    // Default brand structure
    DEFAULT_BRAND: {
        brandId: null,
        brandName: '',
        brandDescription: '',
        isActive: true,
        images: [],
        createdAt: null,
        createdBy: null,
        updatedBy: null,
        updatedAt: null
    }
};

// Action Types Constants
export const BRAND_ACTION_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DEACTIVATE: 'DEACTIVATE',
    ACTIVATE: 'ACTIVATE'
};

// Action Labels
export const BRAND_ACTION_LABELS = {
    [BRAND_ACTION_TYPES.CREATE]: 'Tạo thương hiệu',
    [BRAND_ACTION_TYPES.UPDATE]: 'Cập nhật thông tin',
    [BRAND_ACTION_TYPES.DEACTIVATE]: 'Ngừng bán thương hiệu',
    [BRAND_ACTION_TYPES.ACTIVATE]: 'Kích hoạt thương hiệu'
};

// Sort Options
export const BRAND_SORT_OPTIONS = [
    { key: 'brandName', label: 'Tên thương hiệu', type: 'string' },
    { key: 'brandId', label: 'ID thương hiệu', type: 'number' },
    { key: 'createdAt', label: 'Ngày tạo', type: 'date' },
    { key: 'updatedAt', label: 'Ngày cập nhật', type: 'date' }
];

// filter Options
export const BRAND_FILTER_OPTIONS = {
    STATUS: BRAND_STATUS_OPTIONS,
    DATE_PRESETS: [
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: 'last7days', label: '7 ngày qua' },
        { value: 'last30days', label: '30 ngày qua' },
        { value: 'last3months', label: '3 tháng qua' },
        { value: 'custom', label: 'Tùy chỉnh' }
    ]
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
export const BRAND_VALIDATION_RULES = {
    BRAND_NAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 100,
        REQUIRED: true
    },
    BRAND_DESCRIPTION: {
        MAX_LENGTH: 1000,
        REQUIRED: false
    }
};

// Error Messages
export const BRAND_ERROR_MESSAGES = {
    BRAND_NAME_REQUIRED: 'Tên thương hiệu không được để trống',
    BRAND_NAME_TOO_LONG: 'Tên thương hiệu không được vượt quá 100 ký tự',
    BRAND_DESCRIPTION_TOO_LONG: 'Mô tả thương hiệu không được vượt quá 1000 ký tự',
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra'
};

// Audit log Configuration
export const AUDIT_LOG_CONFIG = {
    MAX_ENTRIES_DISPLAY: 10,
    DATE_FORMAT: 'vi-VN',
    TIMEZONE: 'Asia/Ho_Chi_Minh'
};
