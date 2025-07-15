import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const PoliciesSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'policyName', label: 'Tên chính sách' },
        { key: 'policyId', label: 'ID chính sách' },
        { key: 'createdAt', label: 'Ngày tạo' }
    ];

    const SortButton = ({ sortKey, label }) => (
        <button
            onClick={() => onSort(sortKey)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortConfig.key === sortKey
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
        >
            {label}
            <ArrowUpDown className="w-4 h-4" />
            {sortConfig.key === sortKey && (
                <span className="text-xs">
          {sortConfig.direction === 'asc' ? '↑' : '↓'}
        </span>
            )}
        </button>
    );

    return (
        <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-sm font-medium text-gray-700 flex items-center">
        Sắp xếp theo:
      </span>
            {sortOptions.map(option => (
                <SortButton
                    key={option.key}
                    sortKey={option.key}
                    label={option.label}
                />
            ))}
        </div>
    );
};

export default PoliciesSort;
