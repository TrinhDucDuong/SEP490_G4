import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const EmployeeSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'staffName', label: 'Tên nhân viên' },
        { key: 'accountId', label: 'ID nhân viên' },
        { key: 'totalProcessedOrder', label: 'Tổng đơn xử lý' },
        { key: 'totalRevenue', label: 'Tổng doanh thu' },
        { key: 'createdAt', label: 'Ngày tạo' }
    ];

    const SortButton = ({ sortKey, label }) => (
        <button
            onClick={() => onSort(sortKey)}
            className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors
                ${sortConfig.key === sortKey
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
        >
            <ArrowUpDown size={14} />
            {label}
            {sortConfig.key === sortKey && (
                <span className="text-xs">
                    ({sortConfig.direction === 'asc' ? '↑' : '↓'})
                </span>
            )}
        </button>
    );

    return (
        <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 py-2 pr-2">Sắp xếp theo:</span>
            {sortOptions.map(({ key, label }) => (
                <SortButton key={key} sortKey={key} label={label} />
            ))}
        </div>
    );
};

export default EmployeeSort;
