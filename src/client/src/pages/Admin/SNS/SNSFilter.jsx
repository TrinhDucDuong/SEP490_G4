// src/pages/Admin/SNS/SNSFilter.jsx
import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { SNS_STATUS_OPTIONS } from '../../../utils/constants/SNSConstants.js';

const SNSFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const statusOptions = SNS_STATUS_OPTIONS;

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Lọc theo:</span>

            {/* Status Filter */}
            <div className="relative">
                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                    <X className="w-4 h-4 mr-2" />
                    Xóa bộ lọc
                </button>
            )}
        </div>
    );
};

export default SNSFilter;
