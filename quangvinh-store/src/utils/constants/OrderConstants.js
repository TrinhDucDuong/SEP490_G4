// src/utils/constants/OrderConstants.js

// Order Status Options
export const ORDER_STATUS_OPTIONS = [
    { value: 'PROCESSING', label: 'Đang xử lý', color: 'yellow' },
    { value: 'SHIPPING', label: 'Đang giao hàng', color: 'blue' },
    { value: 'DELIVERED', label: 'Đã giao', color: 'green' },
    { value: 'CANCELED', label: 'Đã hủy', color: 'red' }
];

// Payment Status Options (MỚI THÊM)
export const PAYMENT_STATUS_OPTIONS = [
    { value: false, label: 'Chưa thanh toán', color: 'red' },
    { value: true, label: 'Đã thanh toán', color: 'green' }
];

// Helper Functions
export const ORDER_HELPERS = {
    getStatusText: (status) => {
        const statusMap = {
            'PROCESSING': 'Đang xử lý',
            'SHIPPING': 'Đang giao hàng',
            'DELIVERED': 'Đã giao',
            'CANCELED': 'Đã hủy'
        };
        return statusMap[status] || 'Không xác định';
    },

    getStatusColorClass: (status) => {
        const colorMap = {
            'PROCESSING': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            'SHIPPING': 'bg-blue-100 text-blue-800 border border-blue-200',
            'DELIVERED': 'bg-green-100 text-green-800 border border-green-200',
            'CANCELED': 'bg-red-100 text-red-800 border border-red-200'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
    },

    // MỚI THÊM: Helper cho payment status
    getPaymentStatusText: (paymentStatus) => {
        return paymentStatus === true ? 'Đã thanh toán' : 'Chưa thanh toán';
    },

    getPaymentStatusColorClass: (paymentStatus) => {
        return paymentStatus === true
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

    calculateTotalPrice: (orderDetails) => {
        if (!orderDetails || !Array.isArray(orderDetails)) return 0;
        return orderDetails.reduce((total, detail) => {
            return total + (detail.quantity * detail.unitPrice);
        }, 0);
    },

    getCustomerName: (owner) => {
        if (!owner) return 'Unknown';
        return owner.username || owner.email || 'Unknown';
    },

    getCustomerEmail: (owner) => {
        return owner?.email || '';
    },

    formatCurrency: (amount) => {
        if (amount === null || amount === undefined) return '0 VNĐ';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    }
};

// Sort Options - CẬP NHẬT
export const ORDER_SORT_OPTIONS = [
    { key: 'orderId', label: 'Mã đơn hàng', type: 'number' },
    { key: 'orderDate', label: 'Ngày tạo đơn', type: 'date' },
    { key: 'totalPrice', label: 'Tổng giá tiền', type: 'number' },
    { key: 'orderStatus', label: 'Trạng thái đơn hàng', type: 'string' },
    { key: 'paymentStatus', label: 'Trạng thái thanh toán', type: 'boolean' } // MỚI THÊM
];

// Default values - CẬP NHẬT
export const ORDER_DEFAULTS = {
    DEFAULT_ORDER: {
        orderId: null,
        owner: null,
        orderDate: null,
        orderDetails: [],
        orderStatus: 'PROCESSING',
        paymentStatus: false, // MỚI THÊM
        totalPrice: null
    },
    DEFAULT_OWNER: {
        accountId: null,
        username: 'Unknown',
        email: '',
        isActive: null
    }
};

// Action Types Constants
export const ORDER_ACTION_TYPES = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    UPDATE_STATUS: 'UPDATE_STATUS',
    UPDATE_PAYMENT_STATUS: 'UPDATE_PAYMENT_STATUS' // MỚI THÊM
};

// Error Messages
export const ORDER_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Có lỗi xảy ra khi kết nối với server',
    UNKNOWN_ERROR: 'Có lỗi không xác định xảy ra',
    ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
    INVALID_STATUS: 'Trạng thái đơn hàng không hợp lệ',
    INVALID_PAYMENT_STATUS: 'Trạng thái thanh toán không hợp lệ' // MỚI THÊM
};

// Filter Options - CẬP NHẬT
export const ORDER_FILTER_OPTIONS = {
    STATUS: ORDER_STATUS_OPTIONS,
    PAYMENT_STATUS: PAYMENT_STATUS_OPTIONS, // MỚI THÊM
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
