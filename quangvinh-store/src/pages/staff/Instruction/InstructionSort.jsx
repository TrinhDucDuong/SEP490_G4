import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const InstructionSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'instructionName', label: 'Tên hướng dẫn' },
        { key: 'instructionId', label: 'ID hướng dẫn' },
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
            <span>{label}</span>
            <ArrowUpDown size={14} />
            {sortConfig.key === sortKey && (
                <span className="text-xs">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </button>
    );

    return (
        <div className="flex flex-wrap gap-2 mb-4">
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

export default InstructionSort;
