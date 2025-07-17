import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { STORE_STATUS_OPTIONS } from '../../../utils/constants/StoreConstants';

const StoreFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const statusOptions = STORE_STATUS_OPTIONS;
    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                <div className="relative">
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tất cả</option>
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value.toString()}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                    <X className="h-4 w-4" />
                    Xóa bộ lọc
                </button>
            )}
        </div>
    );
};

export default StoreFilter;
