// src/pages/Staff/Order/OrderSort.jsx
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const OrderSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'orderId', label: 'Mã đơn hàng' },
        { key: 'orderDate', label: 'Ngày tạo đơn' },
        { key: 'totalPrice', label: 'Tổng giá tiền' },
        { key: 'orderStatus', label: 'Trạng thái' }
    ];

    const SortButton = ({ sortKey, label }) => (
        <button
            onClick={() => onSort(sortKey)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                sortConfig.key === sortKey
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
        >
            <ArrowUpDown size={16} />
            <span>{label}</span>
            {sortConfig.key === sortKey && (
                <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </button>
    );

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Sắp xếp theo</h3>
            <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                    <SortButton
                        key={option.key}
                        sortKey={option.key}
                        label={option.label}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrderSort;
