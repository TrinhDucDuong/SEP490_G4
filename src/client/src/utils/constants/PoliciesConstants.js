// Policy Sort Options
export const POLICY_SORT_OPTIONS = [
    { key: 'policyName', label: 'Tên chính sách', type: 'string' },
    { key: 'policyId', label: 'ID chính sách', type: 'number' },
    { key: 'createdAt', label: 'Ngày tạo', type: 'date' }
];

// Helper Functions
export const POLICY_HELPERS = {
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

    validatePolicyData: (policyData) => {
        const errors = [];

        if (!policyData.policyName || policyData.policyName.trim() === '') {
            errors.push('Tên chính sách không được để trống');
        }

        if (policyData.policyName && policyData.policyName.length > 100) {
            errors.push('Tên chính sách không được vượt quá 100 ký tự');
        }

        if (!policyData.policyDescription || policyData.policyDescription.trim() === '') {
            errors.push('Mô tả chính sách không được để trống');
        }

        if (policyData.policyDescription && policyData.policyDescription.length > 1000) {
            errors.push('Mô tả chính sách không được vượt quá 1000 ký tự');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Default values
export const POLICY_DEFAULTS = {
    NEW_POLICY: {
        policyName: '',
        policyDescription: ''
    },

    DEFAULT_POLICY: {
        policyId: null,
        policyName: '',
        policyDescription: '',
        createdAt: null
    }
};

// Error Messages
export const POLICY_ERROR_MESSAGES = {
    POLICY_NAME_REQUIRED: 'Tên chính sách không được để trống',
    POLICY_NAME_TOO_LONG: 'Tên chính sách không được vượt quá 100 ký tự',
    POLICY_DESCRIPTION_REQUIRED: 'Mô tả chính sách không được để trống',
    POLICY_DESCRIPTION_TOO_LONG: 'Mô tả chính sách không được vượt quá 1000 ký tự',
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra'
};

// Filter Options
export const POLICY_FILTER_OPTIONS = {
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
