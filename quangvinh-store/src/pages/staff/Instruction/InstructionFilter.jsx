// src/pages/Staff/Instruction/InstructionFilter.jsx
import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import DateRangePicker from '../../../components/common/admin/DateRangePicker';
import { INSTRUCTION_FILTER_OPTIONS } from '../../../utils/constants/InstructionConstants';

const InstructionFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <ChevronDown size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Lọc dữ liệu:</span>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Ngày tạo:</label>
                    <DateRangePicker
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        datePreset={filters.datePreset}
                        onChange={handleDateRangeChange}
                        presetOptions={INSTRUCTION_FILTER_OPTIONS.DATE_PRESETS}
                    />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X size={14} />
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500">Bộ lọc đang áp dụng:</span>

                        {filters.startDate && filters.endDate && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Ngày: {filters.startDate} - {filters.endDate}
                                <button
                                    onClick={() => {
                                        onFilterChange('startDate', '');
                                        onFilterChange('endDate', '');
                                        onFilterChange('datePreset', '');
                                    }}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X size={10} />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructionFilter;
