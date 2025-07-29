// src/pages/Staff/Order/OrderTable.jsx
import React, { useState } from 'react';
import { Eye, Edit, Trash2, FileText } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Modals from '../../../components/common/Admin/Modals';
import Paginations from '../../../components/common/Admin/Paginations';
import { ORDER_HELPERS, ORDER_STATUS_OPTIONS } from '../../../utils/constants/OrderConstants';

const OrderTable = ({
                        orders,
                        currentPage,
                        setCurrentPage,
                        itemsPerPage,
                        onUpdateOrderStatus,
                        loading
                    }) => {
    // Modal states
    const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
    const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');

    // Modal handlers
    const openOrderDetailModal = (order) => {
        setSelectedOrder(order);
        setShowOrderDetailModal(true);
    };

    const openUpdateStatusModal = (order) => {
        setSelectedOrder(order);
        setSelectedStatus(order.orderStatus);
        setShowUpdateStatusModal(true);
    };

    // CRUD operations
    const handleUpdateStatus = async () => {
        if (!selectedOrder || !selectedStatus) return;

        const result = await onUpdateOrderStatus(selectedOrder.orderId, selectedStatus);
        if (result.success) {
            setShowUpdateStatusModal(false);
            setSelectedOrder(null);
            setSelectedStatus('');
            alert('Cập nhật trạng thái thành công!');
        } else {
            alert(`Lỗi: ${result.error}`);
        }
    };

    // Table columns configuration
    const columns = [
        {
            key: 'stt',
            header: 'STT',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order, index) => (
                <span className="text-sm font-medium text-gray-900">
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
                <span className="text-sm font-mono text-blue-600">
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
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                        {ORDER_HELPERS.getCustomerName(order.owner)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {ORDER_HELPERS.getCustomerEmail(order.owner)}
                    </span>
                </div>
            )
        },
        {
            key: 'orderDetails',
            header: 'Chi tiết đơn hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <button
                    onClick={() => openOrderDetailModal(order)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <FileText size={14} />
                    Xem chi tiết
                </button>
            )
        },
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
        {
            key: 'totalPrice',
            header: 'Tổng giá tiền',
            headerAlign: 'text-right',
            cellAlign: 'text-right',
            render: (order) => (
                <span className="text-sm font-medium text-gray-900">
                    {ORDER_HELPERS.formatCurrency(order.totalPrice)}
                </span>
            )
        },
        {
            key: 'orderStatus',
            header: 'Trạng thái',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_HELPERS.getStatusColorClass(order.orderStatus)}`}>
                    {ORDER_HELPERS.getStatusText(order.orderStatus)}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Thao tác',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => openUpdateStatusModal(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cập nhật trạng thái"
                    >
                        <Edit size={16} />
                    </button>
                </div>
            )
        }
    ];

    // Calculate pagination info
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders.slice(startIndex, endIndex);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Danh sách đơn hàng
                    </h3>
                    <div className="text-sm text-gray-500">
                        Tìm thấy {orders.length} đơn hàng
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={currentOrders}
                        loading={loading}
                        emptyMessage="Không có đơn hàng nào"
                    />

                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Paginations
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={orders.length}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Order Detail Modal */}
            <Modals
                isOpen={showOrderDetailModal}
                onClose={() => setShowOrderDetailModal(false)}
                title="Chi tiết đơn hàng"
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Order Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
                                <p className="mt-1 text-sm text-gray-900">#{selectedOrder.orderId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                                <p className="mt-1 text-sm text-gray-900">{ORDER_HELPERS.formatDate(selectedOrder.orderDate)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Khách hàng</label>
                                <p className="mt-1 text-sm text-gray-900">{ORDER_HELPERS.getCustomerName(selectedOrder.owner)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-sm text-gray-900">{ORDER_HELPERS.getCustomerEmail(selectedOrder.owner)}</p>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Chi tiết sản phẩm</label>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kích cỡ</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Màu sắc</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedOrder.orderDetails.map((detail, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{detail.productVariant.product.productName}</div>
                                                <div className="text-sm text-gray-500">{detail.productVariant.product.productDescription}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {detail.productVariant.product.brand.brandName}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {detail.productVariant.productSize}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-4 h-4 rounded-full mr-2 border"
                                                        style={{backgroundColor: detail.productVariant.color.colorHex}}
                                                    ></div>
                                                    <span className="text-sm text-gray-900">{detail.productVariant.color.colorHex}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                {detail.quantity}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                {ORDER_HELPERS.formatCurrency(detail.unitPrice)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                {ORDER_HELPERS.formatCurrency(detail.quantity * detail.unitPrice)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-gray-900">Tổng cộng:</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {ORDER_HELPERS.formatCurrency(selectedOrder.totalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Modals>

            {/* Update Status Modal */}
            <Modals
                isOpen={showUpdateStatusModal}
                onClose={() => setShowUpdateStatusModal(false)}
                title="Cập nhật trạng thái đơn hàng"
                size="sm"
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đơn hàng #{selectedOrder.orderId}
                            </label>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái mới
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {ORDER_STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowUpdateStatusModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
