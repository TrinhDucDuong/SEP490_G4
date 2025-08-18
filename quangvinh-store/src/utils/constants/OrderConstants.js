// src/utils/constants/OrderConstants.js

// Order Status Options
export const ORDER_STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'SHIPPING', label: 'Đang giao hàng' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELED', label: 'Đã hủy' }
];

export const PAYMENT_STATUS_OPTIONS = [
    { value: '', label: 'Tất cả' },
    { value: 'true', label: 'Đã thanh toán' },
    { value: 'false', label: 'Chưa thanh toán' }
];

// Helper functions cho Order
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

    getCustomerName: (order) => {
        if (order?.shippingAddress?.name) {
            return order.shippingAddress.name;
        }
        if (order?.name) {
            return order.name;
        }
        if (order?.customerName) {
            return order.customerName;
        }
        if (order?.owner) {
            return order.owner.username || order.owner.email || 'Unknown';
        }
        return 'Unknown';
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
