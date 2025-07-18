// src/pages/Admin/SNS/SNSSort.jsx
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SNSSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'snsName', label: 'Tên mạng xã hội' },
        { key: 'snsId', label: 'ID mạng xã hội' }
    ];

    const SortButton = ({ sortKey, label }) => (
        <button
            onClick={() => onSort(sortKey)}
            className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                sortConfig.key === sortKey
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
        >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {label}
            {sortConfig.key === sortKey && (
                <span className="ml-2">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </button>
    );

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
            <div className="flex space-x-2">
                {sortOptions.map((option) => (
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

export default SNSSort;
