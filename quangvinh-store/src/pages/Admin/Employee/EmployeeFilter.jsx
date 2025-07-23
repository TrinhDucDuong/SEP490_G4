import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { EMPLOYEE_STATUS_OPTIONS } from '../../../utils/constants/EmployeeConstants';

const EmployeeFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const statusOptions = EMPLOYEE_STATUS_OPTIONS;

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="relative">
                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <X size={14} />
                    Xóa bộ lọc
                </button>
            )}
        </div>
    );
};

export default EmployeeFilter;
