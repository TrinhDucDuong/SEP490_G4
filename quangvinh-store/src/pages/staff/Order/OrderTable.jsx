import React from 'react';
import { Eye, Edit } from 'lucide-react';
import DataTable from '../../../components/common/Admin/DataTable';
import Paginations from '../../../components/common/Admin/Paginations';
import { ORDER_HELPERS } from '../../../utils/constants/OrderConstants';

const OrderTable = ({
                        orders,
                        currentPage,
                        setCurrentPage,
                        itemsPerPage,
                        loading,
                        onViewOrder,
                        onEditOrder
                    }) => {

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
                <span className="text-sm font-mono text-blue-600 font-medium">
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
                <div className="text-sm">
                    <div className="font-medium text-gray-900">
                        {ORDER_HELPERS.getCustomerName(order)}
                    </div>
                    {order.customerPhoneNumber && (
                        <div className="text-gray-500 text-xs">
                            {order.customerPhoneNumber}
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'orderDate',
            header: 'Ngày đặt hàng',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className="text-sm text-gray-600">
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
                <span className="text-sm font-semibold text-green-600">
          {ORDER_HELPERS.formatCurrency(order.totalPrice)}
        </span>
            )
        },
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
        {
            key: 'paymentStatus',
            header: 'Thanh toán',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${ORDER_HELPERS.getPaymentStatusColorClass(order.paymentStatus)}`}>
          {ORDER_HELPERS.getPaymentStatusText(order.paymentStatus)}
        </span>
            )
        },
        {
            key: 'actions',
            header: 'Thao tác',
            headerAlign: 'text-center',
            cellAlign: 'text-center',
            render: (order) => (
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('View button clicked for order:', order.orderId);
                            onViewOrder(order);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Edit button clicked for order:', order.orderId);
                            onEditOrder(order);
                        }}
                        className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded transition-colors"
                        title="Cập nhật trạng thái"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Calculate pagination
    const totalItems = orders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders.slice(startIndex, endIndex);

    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <DataTable
                columns={columns}
                data={currentOrders}
                loading={loading}
                emptyMessage="Không có đơn hàng nào"
                emptyDescription="Chưa có đơn hàng nào trong hệ thống hoặc không khớp với bộ lọc hiện tại."
            />

            {!loading && totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <Paginations
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                    />
                </div>
            )}
        </div>
    );
};

export default OrderTable;
