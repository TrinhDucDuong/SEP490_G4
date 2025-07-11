import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const ProductSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'name', label: 'Tên sản phẩm' },
        { key: 'code', label: 'Mã sản phẩm' },
        { key: 'price', label: 'Giá' },
        { key: 'quantity', label: 'Số lượng' },
        { key: 'createdDate', label: 'Ngày tạo' }
    ];

    const SortButton = ({ sortKey, label }) => (
        <button
            onClick={() => onSort(sortKey)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                sortConfig.key === sortKey
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
            {label}
            <ArrowUpDown className="h-4 w-4 ml-1" />
            {sortConfig.key === sortKey && (
                <span className="ml-1 text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </button>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Sắp xếp theo:</h3>
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
        </div>
    );
};

export default ProductSort;
