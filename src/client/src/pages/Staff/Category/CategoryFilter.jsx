// src/pages/Staff/Category/CategoryFilter.jsx
import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import DateRangePicker from '../../../components/common/Admin/DateRangePicker';
import { CATEGORY_STATUS_OPTIONS } from '../../../utils/constants/CategoryConstants';

const CategoryFilter = ({ filters, onFilterChange, onClearFilters, parentCategories }) => {
    const statusOptions = CATEGORY_STATUS_OPTIONS;

    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                    </label>
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => onFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                            <option value="">Tất cả trạng thái</option>
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                {/* Parent Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh mục cha
                    </label>
                    <div className="relative">
                        <select
                            value={filters.parentCategory}
                            onChange={(e) => onFilterChange('parentCategory', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                            <option value="">Tất cả danh mục cha</option>
                            {parentCategories.map(category => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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

export default CategoryFilter;
