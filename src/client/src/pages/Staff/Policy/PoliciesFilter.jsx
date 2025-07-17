import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import DateRangePicker from '../../../components/common/Admin/DateRangePicker';
import { POLICY_FILTER_OPTIONS } from '../../../utils/constants/PoliciesConstants';

const PoliciesFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khoảng thời gian
                    </label>
                    <DateRangePicker
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        preset={filters.datePreset}
                        onChange={handleDateRangeChange}
                        presets={POLICY_FILTER_OPTIONS.DATE_PRESETS}
                    />
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">
              Bộ lọc đang áp dụng:
            </span>
                        {filters.datePreset && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                {POLICY_FILTER_OPTIONS.DATE_PRESETS.find(p => p.value === filters.datePreset)?.label}
                                <button
                                    onClick={() => {
                                        onFilterChange('datePreset', '');
                                        onFilterChange('startDate', '');
                                        onFilterChange('endDate', '');
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                  <X className="w-3 h-3" />
                </button>
              </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoliciesFilter;
