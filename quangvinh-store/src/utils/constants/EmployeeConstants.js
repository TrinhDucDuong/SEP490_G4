// Employee Status Options
export const EMPLOYEE_STATUS_OPTIONS = [
    { value: true, label: 'Đang hoạt động', color: 'green' },
    { value: false, label: 'Ngừng hoạt động', color: 'red' }
];

// Helper Functions
export const EMPLOYEE_HELPERS = {
    getStatusText: (isActive) => {
        return isActive ? 'Đang hoạt động' : 'Ngừng hoạt động';
    },

    getStatusColorClass: (isActive) => {
        return isActive
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200';
    },

    formatCurrency: (amount) => {
        return amount.toLocaleString('vi-VN').replace(/,/g, '.') + ' VNĐ';
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

    validateEmployeeData: (employeeData) => {
        const errors = [];

        if (!employeeData.firstName || employeeData.firstName.trim() === '') {
            errors.push('Tên nhân viên không được để trống');
        }

        if (!employeeData.lastName || employeeData.lastName.trim() === '') {
            errors.push('Họ nhân viên không được để trống');
        }

        if (!employeeData.username || employeeData.username.trim() === '') {
            errors.push('Tên tài khoản không được để trống');
        }

        if (!employeeData.password || employeeData.password.trim() === '') {
            errors.push('Mật khẩu không được để trống');
        }

        if (!employeeData.phoneNumber || employeeData.phoneNumber.trim() === '') {
            errors.push('Số điện thoại không được để trống');
        }

        if (!employeeData.workingAtStoreId) {
            errors.push('Vui lòng chọn địa chỉ làm việc');
        }

        // Validate phone number format
        if (employeeData.phoneNumber && !/^[0-9]{10,11}$/.test(employeeData.phoneNumber)) {
            errors.push('Số điện thoại phải có 10-11 chữ số');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Default values
export const EMPLOYEE_DEFAULTS = {
    NEW_EMPLOYEE: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        phoneNumber: '',
        workingAtStoreId: ''
    }
};

// Sort Options
export const EMPLOYEE_SORT_OPTIONS = [
    { key: 'staffName', label: 'Tên nhân viên', type: 'string' },
    { key: 'accountId', label: 'ID nhân viên', type: 'number' },
    { key: 'totalProcessedOrder', label: 'Tổng đơn xử lý', type: 'number' },
    { key: 'totalRevenue', label: 'Tổng doanh thu', type: 'number' },
    { key: 'createdAt', label: 'Ngày tạo', type: 'date' }
];

// Error Messages
export const EMPLOYEE_ERROR_MESSAGES = {
    FIRST_NAME_REQUIRED: 'Tên nhân viên không được để trống',
    LAST_NAME_REQUIRED: 'Họ nhân viên không được để trống',
    USERNAME_REQUIRED: 'Tên tài khoản không được để trống',
    PASSWORD_REQUIRED: 'Mật khẩu không được để trống',
    PHONE_REQUIRED: 'Số điện thoại không được để trống',
    PHONE_INVALID: 'Số điện thoại phải có 10-11 chữ số',
    STORE_REQUIRED: 'Vui lòng chọn địa chỉ làm việc',
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra'
};
