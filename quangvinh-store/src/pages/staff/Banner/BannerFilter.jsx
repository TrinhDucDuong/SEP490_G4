import React from 'react';
import { ChevronDown, X, Plus } from 'lucide-react';
import { BANNER_STATUS_OPTIONS } from '../../../utils/constants/BannerConstants';

const BannerFilter = ({ filters, onFilterChange, onClearFilters, onCreateNew }) => {
    const statusOptions = BANNER_STATUS_OPTIONS;

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left side - Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Status filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Trạng thái:
                        </label>
                        <div className="relative">
                            <select
                                value={filters.status}
                                onChange={(e) => onFilterChange('status', e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                        >
                            <X className="h-4 w-4" />
                            Xóa bộ lọc
                        </button>
                    )}
                </div>

                {/* Right side - Create Button */}
                <button
                    onClick={onCreateNew}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                    <Plus className="h-4 w-4" />
                    Thêm banner mới
                </button>
            </div>
        </div>
    );
};

export default BannerFilter;
