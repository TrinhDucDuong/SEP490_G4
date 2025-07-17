// src/pages/Staff/Product/ProductSort.jsx

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const ProductSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'productName', label: 'Tên sản phẩm' },
        { key: 'productId', label: 'ID sản phẩm' },
        { key: 'unitPrice', label: 'Giá bán' },
        { key: 'createdAt', label: 'Ngày tạo' }
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
            <ArrowUpDown className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="mb-4">
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

export default ProductSort;
