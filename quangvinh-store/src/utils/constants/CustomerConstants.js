// Helper Functions
export const CUSTOMER_HELPERS = {
    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    formatPhone: (phoneNumber) => {
        if (!phoneNumber) return '';
        // Format phone number as XXX-XXX-XXXX
        return phoneNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    },

    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    getFullName: (customer) => {
        return customer?.fullName || 'Không có tên';
    },

    formatUsername: (username) => {
        return username || 'Không có username';
    }
};

// Sort Options
export const CUSTOMER_SORT_OPTIONS = [
    { key: 'fullName', label: 'Tên khách hàng', type: 'string' },
    { key: 'accountId', label: 'ID khách hàng', type: 'number' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'phoneNumber', label: 'Số điện thoại', type: 'string' }
];

// Default values
export const CUSTOMER_DEFAULTS = {
    DEFAULT_CUSTOMER: {
        accountId: null,
        username: '',
        email: '',
        fullName: '',
        isActive: true,
        birthDate: null,
        phoneNumber: ''
    }
};

// API Response Status
export const API_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    LOADING: 'loading'
};

// Error Messages
export const CUSTOMER_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra',
    NO_DATA: 'Không có dữ liệu khách hàng'
};
