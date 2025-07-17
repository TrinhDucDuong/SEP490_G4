// src/pages/Staff/Category/CategorySort.jsx
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const CategorySort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'categoryName', label: 'Tên danh mục' },
        { key: 'categoryId', label: 'ID danh mục' },
        { key: 'createdAt', label: 'Ngày tạo' },
        { key: 'parentCategoryName', label: 'Danh mục cha' }
    ];

    const SortButton = ({ sortKey, label }) => (
        <button
            onClick={() => onSort(sortKey)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
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
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sắp xếp</h3>
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

export default CategorySort;
