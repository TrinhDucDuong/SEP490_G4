// src/pages/Staff/Order/OrderSort.jsx
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const OrderSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'orderId', label: 'Mã đơn hàng' },
        { key: 'orderDate', label: 'Ngày tạo đơn' },
        { key: 'totalPrice', label: 'Tổng giá tiền' },
        { key: 'orderStatus', label: 'Trạng thái đơn hàng' }, // CẬP NHẬT label
        { key: 'paymentStatus', label: 'Trạng thái thanh toán' } // MỚI THÊM
    ];

    const SortButton = ({ sortKey, label }) => (
        <button
            onClick={() => onSort(sortKey)}
            className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                sortConfig.key === sortKey
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
        >
            <span>{label}</span>
            <ArrowUpDown size={14} className={`${
                sortConfig.key === sortKey
                    ? (sortConfig.direction === 'asc' ? 'rotate-180' : '')
                    : 'opacity-50'
            }`} />
        </button>
    );

    return (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700 self-center">Sắp xếp theo:</span>
            {sortOptions.map((option) => (
                <SortButton
                    key={option.key}
                    sortKey={option.key}
                    label={option.label}
                />
            ))}
        </div>
    );
};

export default OrderSort;
