import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import DateRangePicker from '../../../components/common/Admin/DateRangePicker';
import { BRAND_STATUS_OPTIONS } from '../../../utils/constants/BrandConstants';

const BrandFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const statusOptions = BRAND_STATUS_OPTIONS;

    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Bộ lọc</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                    </label>
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => onFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        >
                            <option value="">Tất cả trạng thái</option>
                            {statusOptions.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày tạo
                    </label>
                    <DateRangePicker
                        value={{
                            startDate: filters.startDate,
                            endDate: filters.endDate,
                            preset: filters.datePreset
                        }}
                        onChange={handleDateRangeChange}
                        placeholder="Chọn khoảng thời gian"
                    />
                </div>
            </div>
        </div>
    );
};

export default BrandFilter;
