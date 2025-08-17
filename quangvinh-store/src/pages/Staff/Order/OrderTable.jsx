// src/pages/Staff/Order/OrderTable.jsx
import React, { useState } from 'react';
import { Eye, Edit, Trash2, FileText } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modals from '../../../components/common/Admin/Modals';
import Paginations from '../../../components/common/Admin/Paginations';
import { ORDER_HELPERS, ORDER_STATUS_OPTIONS } from '../../../utils/constants/OrderConstants';

const OrderTable = ({ orders, currentPage, setCurrentPage, itemsPerPage, onUpdateOrderStatus, loading }) => {
    // Modal states
    const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState('');

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Show toast function
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Modal handlers
    const openOrderDetailModal = (order) => {
        setSelectedOrder(order);
        setShowOrderDetailModal(true);
    };

    const openUpdateStatusModal = (order) => {
        setSelectedOrder(order);
        setSelectedOrderStatus(order.orderStatus);
        setShowUpdateStatusModal(true);
    };

    // CRUD operations - CHỈ CẬP NHẬT TRẠNG THÁI ĐĂN HÀNG
    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;

        const updateData = {
            orderStatus: selectedOrderStatus
        };

        const result = await onUpdateOrderStatus(selectedOrder.orderId, updateData);
        if (result.success) {
            setShowUpdateStatusModal(false);
            setSelectedOrder(null);
            setSelectedOrderStatus('');
            showToast('Cập nhật trạng thái thành công!', 'success');
        } else {
            showToast(`Lỗi: ${result.error}`, 'error');
        }
    };

    // Table columns configuration - SỬA LẠI THỨ TỰ VÀ THÊM LẠI CỘT PAYMENT STATUS
    const columns = [
        // 1. STT
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order, index) => (
                <span className="text-sm font-medium text-gray-700">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
            )
        },
        // 2. Mã đơn hàng
        {
            key: 'orderId',
            header: 'Mã đơn hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className="text-sm font-semibold text-blue-600">
          #{order.orderId}
        </span>
            )
        },
        // 3. Tên khách hàng
        {
            key: 'customerName',
            header: 'Tên khách hàng',
            headerAlign: 'text-left',
            cellAlign: 'text-left',
            render: (order) => (
                <div className="text-sm">
                    <div className="font-medium text-gray-900">
                        {order.customerName || 'Không có tên'}
                    </div>
                    {order.customerPhoneNumber && (
                        <div className="text-gray-500">
                            {order.customerPhoneNumber}
                        </div>
                    )}
                </div>
            )
        },
        // 4. Tổng tiền
        {
            key: 'totalPrice',
            header: 'Tổng tiền',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className="text-sm font-semibold text-gray-900">
          {ORDER_HELPERS.formatCurrency(order.totalPrice || ORDER_HELPERS.calculateTotalPrice(order.orderDetails))}
        </span>
            )
        },
        // 5. Trạng thái đơn hàng
        {
            key: 'orderStatus',
            header: 'Trạng thái đơn hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${ORDER_HELPERS.getStatusColorClass(order.orderStatus)}`}>
          {ORDER_HELPERS.getStatusText(order.orderStatus)}
        </span>
            )
        },
        // 6. Trạng thái thanh toán - THÊM LẠI
        {
            key: 'paymentStatus',
            header: 'Trạng thái thanh toán',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${ORDER_HELPERS.getPaymentStatusColorClass(order.paymentStatus)}`}>
          {ORDER_HELPERS.getPaymentStatusText(order.paymentStatus)}
        </span>
            )
        },
        // 7. Ngày tạo đơn
        {
            key: 'orderDate',
            header: 'Ngày tạo đơn',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className="text-sm text-gray-700">
          {ORDER_HELPERS.formatDate(order.orderDate)}
        </span>
            )
        },
        // 8. Hành động
        {
            key: 'actions',
            header: 'Hành động',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openOrderDetailModal(order);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Xem chi tiết"
                        type="button"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openUpdateStatusModal(order);
                        }}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Cập nhật trạng thái"
                        type="button"
                    >
                        <Edit size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-4">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
                    toast.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                }`}>
                    <div className="flex items-center space-x-2">
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Order Table */}
            <DataTable
                data={orders}
                columns={columns}
                loading={loading}
                emptyMessage="Không có đơn hàng nào"
            />

            {/* Pagination */}
            <Paginations
                currentPage={currentPage}
                totalItems={orders.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            {/* Order Detail Modal */}
            <Modals
                show={showOrderDetailModal}
                onClose={() => {
                    setShowOrderDetailModal(false);
                    setSelectedOrder(null);
                }}
                title="Chi tiết đơn hàng"
                size="xl"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <strong>Mã đơn hàng:</strong> #{selectedOrder.orderId}
                            </div>
                            <div>
                                <strong>Ngày tạo:</strong> {ORDER_HELPERS.formatDate(selectedOrder.orderDate)}
                            </div>
                            <div>
                                <strong>Trạng thái đơn hàng:</strong>
                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${ORDER_HELPERS.getStatusColorClass(selectedOrder.orderStatus)}`}>
                  {ORDER_HELPERS.getStatusText(selectedOrder.orderStatus)}
                </span>
                            </div>
                            <div>
                                <strong>Trạng thái thanh toán:</strong>
                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${ORDER_HELPERS.getPaymentStatusColorClass(selectedOrder.paymentStatus)}`}>
                  {ORDER_HELPERS.getPaymentStatusText(selectedOrder.paymentStatus)}
                </span>
                            </div>
                            <div>
                                <strong>Tên khách hàng:</strong> {selectedOrder.customerName || 'Không có tên'}
                            </div>
                            {selectedOrder.customerPhoneNumber && (
                                <div>
                                    <strong>Số điện thoại:</strong> {selectedOrder.customerPhoneNumber}
                                </div>
                            )}
                            {selectedOrder.shippingAddress && (
                                <div className="col-span-2">
                                    <strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress}
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thương hiệu</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kích cỡ</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Màu sắc</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {selectedOrder.orderDetails?.map((detail, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-sm">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {detail.productVariant.product.productName}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    {detail.productVariant.product.productDescription}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {detail.productVariant.product.brand.brandName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {detail.productVariant.productSize}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex items-center space-x-2">
                                                {detail.productVariant.color?.colorHex && (
                                                    <div
                                                        className="w-6 h-6 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: detail.productVariant.color.colorHex }}
                                                    ></div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {detail.quantity}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {ORDER_HELPERS.formatCurrency(detail.unitPrice)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {ORDER_HELPERS.formatCurrency(detail.quantity * detail.unitPrice)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan="6" className="px-4 py-3 text-sm font-medium text-right">
                                        Tổng cộng:
                                    </td>
                                    <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                        {ORDER_HELPERS.formatCurrency(selectedOrder.totalPrice || ORDER_HELPERS.calculateTotalPrice(selectedOrder.orderDetails))}
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Update Status Modal - CHỈ CÓ TRẠNG THÁI ĐĂN HÀNG */}
            <Modals
                show={showUpdateStatusModal}
                onClose={() => {
                    setShowUpdateStatusModal(false);
                    setSelectedOrder(null);
                    setSelectedOrderStatus('');
                }}
                title={`Cập nhật trạng thái - Đơn hàng #${selectedOrder?.orderId}`}
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái đơn hàng
                        </label>
                        <select
                            value={selectedOrderStatus}
                            onChange={(e) => setSelectedOrderStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {ORDER_STATUS_OPTIONS.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowUpdateStatusModal(false);
                                setSelectedOrder(null);
                                setSelectedOrderStatus('');
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdateStatus}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            </Modals>
        </div>
    );
};

export default OrderTable;
