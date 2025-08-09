// src/pages/Staff/Order/OrderTable.jsx
import React, { useState } from 'react';
import { Eye, Edit, Trash2, FileText } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modals from '../../../components/common/Admin/Modals';
import Paginations from '../../../components/common/Admin/Paginations';
import { ORDER_HELPERS, ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from '../../../utils/constants/OrderConstants';

const OrderTable = ({ orders, currentPage, setCurrentPage, itemsPerPage, onUpdateOrderStatus, loading }) => {
    // Modal states
    const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(false); // MỚI THÊM

    // Modal handlers
    const openOrderDetailModal = (order) => {
        setSelectedOrder(order);
        setShowOrderDetailModal(true);
    };

    const openUpdateStatusModal = (order) => {
        setSelectedOrder(order);
        setSelectedOrderStatus(order.orderStatus);
        setSelectedPaymentStatus(order.paymentStatus || false); // MỚI THÊM
        setShowUpdateStatusModal(true);
    };

    // CRUD operations - CẬP NHẬT
    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;

        const updateData = {
            orderStatus: selectedOrderStatus,
            paymentStatus: selectedPaymentStatus
        };

        const result = await onUpdateOrderStatus(selectedOrder.orderId, updateData);
        if (result.success) {
            setShowUpdateStatusModal(false);
            setSelectedOrder(null);
            setSelectedOrderStatus('');
            setSelectedPaymentStatus(false);
            alert('Cập nhật trạng thái thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    // Table columns configuration - CẬP NHẬT
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order, index) => (
                <span className="font-medium text-gray-900">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
            )
        },
        {
            key: 'orderId',
            header: 'Mã đơn hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className="font-mono text-blue-600 font-semibold">
          #{order.orderId}
        </span>
            )
        },
        {
            key: 'customerName',
            header: 'Tên khách hàng',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (order) => (
                <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                        {ORDER_HELPERS.getCustomerName(order.owner)}
                    </div>
                    <div className="text-sm text-gray-500">
                        {ORDER_HELPERS.getCustomerEmail(order.owner)}
                    </div>
                </div>
            )
        },
        {
            key: 'orderDate',
            header: 'Ngày tạo đơn',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className="text-gray-700">
          {ORDER_HELPERS.formatDate(order.orderDate)}
        </span>
            )
        },
        {
            key: 'totalPrice',
            header: 'Tổng tiền',
            headerAlign: 'text-right',
            cellAlign: 'text-right',
            render: (order) => (
                <span className="font-semibold text-green-600">
          {ORDER_HELPERS.formatCurrency(order.totalPrice)}
        </span>
            )
        },
        {
            key: 'orderStatus', // CẬP NHẬT tên header
            header: 'Trạng thái đơn hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_HELPERS.getStatusColorClass(order.orderStatus)}`}>
          {ORDER_HELPERS.getStatusText(order.orderStatus)}
        </span>
            )
        },
        // MỚI THÊM: Cột trạng thái thanh toán
        {
            key: 'paymentStatus',
            header: 'Trạng thái thanh toán',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_HELPERS.getPaymentStatusColorClass(order.paymentStatus)}`}>
          {ORDER_HELPERS.getPaymentStatusText(order.paymentStatus)}
        </span>
            )
        },
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => openOrderDetailModal(order)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => openUpdateStatusModal(order)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Cập nhật trạng thái"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <DataTable
                data={orders}
                columns={columns}
                loading={loading}
                emptyMessage="Không có đơn hàng nào"
            />

            <div className="px-6 py-4 border-t border-gray-200">
                <Paginations
                    currentPage={currentPage}
                    totalItems={orders.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Order Detail Modal - CẬP NHẬT độ rộng */}
            <Modals
                isOpen={showOrderDetailModal}
                onClose={() => setShowOrderDetailModal(false)}
                title="Chi tiết đơn hàng"
                size="4xl" // Tăng kích thước từ 'lg' lên '4xl'
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Thông tin đơn hàng */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Thông tin đơn hàng</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Mã đơn hàng:</span> #{selectedOrder.orderId}</p>
                                    <p><span className="font-medium">Ngày tạo:</span> {ORDER_HELPERS.formatDate(selectedOrder.orderDate)}</p>
                                    <p><span className="font-medium">Trạng thái đơn hàng:</span>
                                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_HELPERS.getStatusColorClass(selectedOrder.orderStatus)}`}>
                      {ORDER_HELPERS.getStatusText(selectedOrder.orderStatus)}
                    </span>
                                    </p>
                                    <p><span className="font-medium">Trạng thái thanh toán:</span>
                                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_HELPERS.getPaymentStatusColorClass(selectedOrder.paymentStatus)}`}>
                      {ORDER_HELPERS.getPaymentStatusText(selectedOrder.paymentStatus)}
                    </span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Tên:</span> {ORDER_HELPERS.getCustomerName(selectedOrder.owner)}</p>
                                    <p><span className="font-medium">Email:</span> {ORDER_HELPERS.getCustomerEmail(selectedOrder.owner)}</p>
                                    {selectedOrder.customerPhoneNumber && (
                                        <p><span className="font-medium">Số điện thoại:</span> {selectedOrder.customerPhoneNumber}</p>
                                    )}
                                    {selectedOrder.shippingAddress && (
                                        <p><span className="font-medium">Địa chỉ giao hàng:</span> {selectedOrder.shippingAddress}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chi tiết sản phẩm */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Chi tiết sản phẩm</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kích cỡ</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Màu sắc</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedOrder.orderDetails?.map((detail, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {detail.productVariant.product.productName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {detail.productVariant.product.productDescription}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900">
                                                {detail.productVariant.product.brand.brandName}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 text-center">
                                                {detail.productVariant.productSize}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <div
                                                        className="w-6 h-6 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: detail.productVariant.color.colorHex }}
                                                        title={detail.productVariant.color.colorHex}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 text-center">
                                                {detail.quantity}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 text-right">
                                                {ORDER_HELPERS.formatCurrency(detail.unitPrice)}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                                                {ORDER_HELPERS.formatCurrency(detail.quantity * detail.unitPrice)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="6" className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                            Tổng cộng:
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                            {ORDER_HELPERS.formatCurrency(selectedOrder.totalPrice || ORDER_HELPERS.calculateTotalPrice(selectedOrder.orderDetails))}
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Update Status Modal - CẬP NHẬT */}
            <Modals
                isOpen={showUpdateStatusModal}
                onClose={() => setShowUpdateStatusModal(false)}
                title="Cập nhật trạng thái đơn hàng"
                size="md"
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-4">
                                Đơn hàng: #{selectedOrder.orderId}
                            </p>
                        </div>

                        {/* Trạng thái đơn hàng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái đơn hàng
                            </label>
                            <select
                                value={selectedOrderStatus}
                                onChange={(e) => setSelectedOrderStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {ORDER_STATUS_OPTIONS.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* MỚI THÊM: Trạng thái thanh toán */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái thanh toán
                            </label>
                            <select
                                value={selectedPaymentStatus}
                                onChange={(e) => setSelectedPaymentStatus(e.target.value === 'true')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {PAYMENT_STATUS_OPTIONS.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setShowUpdateStatusModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                )}
            </Modals>
        </div>
    );
};

export default OrderTable;
