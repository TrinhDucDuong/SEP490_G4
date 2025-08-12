import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const BrandSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'brandName', label: 'Tên thương hiệu' },
        { key: 'brandId', label: 'ID thương hiệu' },
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
            {sortConfig.key === sortKey && (
                <span className="text-xs">
          {sortConfig.direction === 'asc' ? '↑' : '↓'}
        </span>
            )}
        </button>
    );

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
            </div>
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

export default BrandSort;
