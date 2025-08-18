// src/pages/Staff/Order/OrderModal.jsx
import React, { useState } from 'react';
import Modals from '../../../components/common/Admin/Modals';
import { ORDER_HELPERS, ORDER_STATUS_OPTIONS } from '../../../utils/constants/OrderConstants';

const OrderModal = ({
                        showDetailModal,
                        showUpdateModal,
                        selectedOrder,
                        onCloseDetailModal,
                        onCloseUpdateModal,
                        onUpdateOrderStatus
                    }) => {
    const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Show toast function
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Validate trạng thái transition
    const validateStatusTransition = (currentStatus, newStatus) => {
        const statusFlow = {
            'PROCESSING': ['SHIPPING', 'CANCELED'],
            'SHIPPING': ['DELIVERED', 'CANCELED'],
            'DELIVERED': ['CANCELED'],
            'CANCELED': []
        };
        const validTransitions = statusFlow[currentStatus] || [];
        return validTransitions.includes(newStatus);
    };

    // Get validation message
    const getValidationMessage = (currentStatus, newStatus) => {
        const messages = {
            'PROCESSING_DELIVERED': 'Đơn hàng đang xử lý không thể chuyển thẳng thành đã giao. Vui lòng chuyển qua trạng thái đang giao hàng trước.',
            'SHIPPING_PROCESSING': 'Đơn hàng đang vận chuyển không thể đổi thành đang xử lý.',
            'DELIVERED_PROCESSING': 'Đơn hàng đã giao không thể đổi thành đang xử lý.',
            'DELIVERED_SHIPPING': 'Đơn hàng đã giao không thể đổi thành đang giao hàng.',
            'CANCELED_ANY': 'Đơn hàng đã hủy không thể thay đổi trạng thái.'
        };

        if (currentStatus === 'CANCELED') return messages.CANCELED_ANY;
        if (currentStatus === 'PROCESSING' && newStatus === 'DELIVERED') return messages.PROCESSING_DELIVERED;
        if (currentStatus === 'SHIPPING' && newStatus === 'PROCESSING') return messages.SHIPPING_PROCESSING;
        if (currentStatus === 'DELIVERED' && newStatus === 'PROCESSING') return messages.DELIVERED_PROCESSING;
        if (currentStatus === 'DELIVERED' && newStatus === 'SHIPPING') return messages.DELIVERED_SHIPPING;

        return 'Không thể thay đổi trạng thái này.';
    };

    // Handle update status
    const handleUpdateStatus = async () => {
        if (!selectedOrder || !selectedOrderStatus) return;

        // Kiểm tra nếu trạng thái không thay đổi
        if (selectedOrderStatus === selectedOrder.orderStatus) {
            showToast('Vui lòng chọn trạng thái khác để cập nhật.', 'error');
            return;
        }

        // Validate trạng thái transition
        if (!validateStatusTransition(selectedOrder.orderStatus, selectedOrderStatus)) {
            const message = getValidationMessage(selectedOrder.orderStatus, selectedOrderStatus);
            showToast(message, 'error');
            return;
        }

        const updateData = { orderStatus: selectedOrderStatus };
        const result = await onUpdateOrderStatus(selectedOrder.orderId, updateData);

        if (result.success) {
            showToast('Cập nhật trạng thái thành công!', 'success');
            setTimeout(() => {
                onCloseUpdateModal();
            }, 1000);
        } else {
            showToast(`Lỗi: ${result.error}`, 'error');
        }
    };

    // Reset selected status khi mở modal
    React.useEffect(() => {
        if (showUpdateModal && selectedOrder) {
            setSelectedOrderStatus(selectedOrder.orderStatus);
        }
    }, [showUpdateModal, selectedOrder]);

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                    toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {toast.message}
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedOrder && (
                <Modals
                    isOpen={showDetailModal}
                    onClose={onCloseDetailModal}
                    title={`Chi tiết đơn hàng #${selectedOrder.orderId}`}
                    size="xl"
                    showCloseButton={true}
                >
                    <div className="space-y-6">
                        {/* Thông tin đơn hàng */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mã đơn hàng:</span>
                                        <span className="font-mono text-blue-600">#{selectedOrder.orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ngày đặt:</span>
                                        <span>{ORDER_HELPERS.formatDate(selectedOrder.orderDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ORDER_HELPERS.getStatusColorClass(selectedOrder.orderStatus)}`}>
                      {ORDER_HELPERS.getStatusText(selectedOrder.orderStatus)}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thanh toán:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ORDER_HELPERS.getPaymentStatusColorClass(selectedOrder.paymentStatus)}`}>
                      {ORDER_HELPERS.getPaymentStatusText(selectedOrder.paymentStatus)}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Thông tin khách hàng</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tên khách hàng:</span>
                                        <span>{ORDER_HELPERS.getCustomerName(selectedOrder)}</span>
                                    </div>
                                    {selectedOrder.customerPhoneNumber && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Số điện thoại:</span>
                                            <span>{selectedOrder.customerPhoneNumber}</span>
                                        </div>
                                    )}
                                    {selectedOrder.deliveryAddress && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Địa chỉ giao hàng:</span>
                                            <span className="text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chi tiết sản phẩm */}
                        {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Chi tiết sản phẩm</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích cỡ</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Màu sắc</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedOrder.orderDetails.map((detail, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {detail.productVariant.product.productName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {detail.productVariant.product.brand.brandName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {detail.productVariant.productSize}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {detail.productVariant.color?.colorHex && (
                                                            <div
                                                                className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                                                style={{ backgroundColor: detail.productVariant.color.colorHex }}
                                                            ></div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                    {detail.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                    {ORDER_HELPERS.formatCurrency(detail.unitPrice)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                    {ORDER_HELPERS.formatCurrency(detail.quantity * detail.unitPrice)}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                Tổng cộng:
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                                                {ORDER_HELPERS.formatCurrency(selectedOrder.totalPrice || ORDER_HELPERS.calculateTotalPrice(selectedOrder.orderDetails))}
                                            </td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </Modals>
            )}

            {/* Update Status Modal */}
            {showUpdateModal && selectedOrder && (
                <Modals
                    isOpen={showUpdateModal}
                    onClose={onCloseUpdateModal}
                    title={`Cập nhật trạng thái đơn hàng #${selectedOrder.orderId}`}
                    size="md"
                    showCloseButton={true}
                >
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Thông tin đơn hàng</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <span className="ml-2 font-mono text-blue-600">#{selectedOrder.orderId}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Khách hàng:</span>
                                    <span className="ml-2">{ORDER_HELPERS.getCustomerName(selectedOrder)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Trạng thái hiện tại:</span>
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${ORDER_HELPERS.getStatusColorClass(selectedOrder.orderStatus)}`}>
                    {ORDER_HELPERS.getStatusText(selectedOrder.orderStatus)}
                  </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Tổng tiền:</span>
                                    <span className="ml-2 font-semibold text-green-600">
                    {ORDER_HELPERS.formatCurrency(selectedOrder.totalPrice)}
                  </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn trạng thái mới
                            </label>
                            <select
                                id="orderStatus"
                                value={selectedOrderStatus}
                                onChange={(e) => setSelectedOrderStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {ORDER_STATUS_OPTIONS
                                    .filter(option => option.value !== '') // Loại bỏ option "Tất cả trạng thái"
                                    .map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onCloseUpdateModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateStatus}
                                disabled={!selectedOrderStatus || selectedOrderStatus === selectedOrder.orderStatus}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </Modals>
            )}
        </>
    );
};

export default OrderModal;
