// src/pages/Staff/Order/OrderFilter.jsx
import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import DateRangePicker from '../../../components/common/Admin/DateRangePicker';
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from '../../../utils/constants/OrderConstants';

const OrderFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const statusOptions = ORDER_STATUS_OPTIONS;
    const paymentStatusOptions = PAYMENT_STATUS_OPTIONS; // MỚI THÊM

    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
                <h3 className="text-sm font-medium text-gray-700">Bộ lọc:</h3>

                {/* Filter by Order Status */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Trạng thái đơn hàng</label>
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => onFilterChange('status', e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tất cả trạng thái</option>
                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* MỚI THÊM: Filter by Payment Status */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Trạng thái thanh toán</label>
                    <div className="relative">
                        <select
                            value={filters.paymentStatus}
                            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tất cả trạng thái</option>
                            {paymentStatusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Thời gian</label>
                    <DateRangePicker
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        preset={filters.datePreset}
                        onChange={handleDateRangeChange}
                    />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                    >
                        <X size={14} />
                        <span>Xóa bộ lọc</span>
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500">Đang lọc:</span>

                        {filters.status && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Trạng thái: {statusOptions.find(s => s.value === filters.status)?.label}
              </span>
                        )}

                        {filters.paymentStatus !== '' && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Thanh toán: {paymentStatusOptions.find(s => s.value.toString() === filters.paymentStatus.toString())?.label}
              </span>
                        )}

                        {filters.startDate && filters.endDate && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                {filters.startDate} - {filters.endDate}
              </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderFilter;
