// src/pages/Staff/Order/OrderFilter.jsx
import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import DateRangePicker from '../../../components/common/Admin/DateRangePicker';
import { ORDER_STATUS_OPTIONS } from '../../../utils/constants/OrderConstants';

const OrderFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const statusOptions = ORDER_STATUS_OPTIONS;

    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Lọc dữ liệu</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <X size={14} />
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái đơn hàng
                    </label>
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => onFilterChange('status', e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                            <option value="">Tất cả trạng thái</option>
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Date Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày tạo đơn
                    </label>
                    <DateRangePicker
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        onDateRangeChange={handleDateRangeChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderFilter;
