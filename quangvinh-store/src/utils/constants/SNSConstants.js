// src/utils/constants/SNSConstants.js

// SNS Status Options
export const SNS_STATUS_OPTIONS = [
    { value: true, label: 'Đang hoạt động', color: 'green' },
    { value: false, label: 'Ngừng hoạt động', color: 'red' }
];

// Helper Functions
export const SNS_HELPERS = {
    getStatusText: (isActive) => {
        return isActive ? 'Đang hoạt động' : 'Ngừng hoạt động';
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

    validateSNSData: (snsData) => {
        const errors = [];

        if (!snsData.snsName || snsData.snsName.trim() === '') {
            errors.push('Tên mạng xã hội không được để trống');
        }

        if (snsData.snsName && snsData.snsName.length > 100) {
            errors.push('Tên mạng xã hội không được vượt quá 100 ký tự');
        }

        if (!snsData.snsUrl || snsData.snsUrl.trim() === '') {
            errors.push('Đường dẫn đến trang không được để trống');
        }

        if (!snsData.snsChatUrl || snsData.snsChatUrl.trim() === '') {
            errors.push('Đường dẫn đến hộp thư không được để trống');
        }

        // Validate URL format
        const urlPattern = /^https?:\/\/.+/;
        if (snsData.snsUrl && !urlPattern.test(snsData.snsUrl)) {
            errors.push('Đường dẫn đến trang phải có định dạng URL hợp lệ');
        }

        if (snsData.snsChatUrl && !urlPattern.test(snsData.snsChatUrl)) {
            errors.push('Đường dẫn đến hộp thư phải có định dạng URL hợp lệ');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Default values
export const SNS_DEFAULTS = {
    NEW_SNS: {
        snsName: '',
        snsUrl: '',
        snsChatUrl: ''
    },

    DEFAULT_SNS: {
        snsId: null,
        snsName: '',
        snsUrl: '',
        snsChatUrl: '',
        isActive: true
    }
};

// Sort Options
export const SNS_SORT_OPTIONS = [
    { key: 'snsName', label: 'Tên mạng xã hội', type: 'string' },
    { key: 'snsId', label: 'ID mạng xã hội', type: 'number' }
];

// Filter Options
export const SNS_FILTER_OPTIONS = {
    STATUS: SNS_STATUS_OPTIONS
};

// Error Messages
export const SNS_ERROR_MESSAGES = {
    SNS_NAME_REQUIRED: 'Tên mạng xã hội không được để trống',
    SNS_NAME_TOO_LONG: 'Tên mạng xã hội không được vượt quá 100 ký tự',
    SNS_URL_REQUIRED: 'Đường dẫn đến trang không được để trống',
    SNS_CHAT_URL_REQUIRED: 'Đường dẫn đến hộp thư không được để trống',
    INVALID_URL_FORMAT: 'URL phải có định dạng hợp lệ',
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra'
};
