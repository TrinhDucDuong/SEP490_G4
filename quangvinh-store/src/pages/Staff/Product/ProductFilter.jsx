// src/pages/Staff/Product/ProductFilter.jsx

import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import DateRangePicker from '../../../components/common/Admin/DateRangePicker';
import { PRODUCT_STATUS_OPTIONS } from '../../../utils/constants/ProductConstants';

const ProductFilter = ({ filters, onFilterChange, onClearFilters, brands, categories }) => {
    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Brand Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thương hiệu
                    </label>
                    <select
                        value={filters.brand}
                        onChange={(e) => onFilterChange('brand', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả thương hiệu</option>
                        {brands.map(brand => (
                            <option key={brand.brandId} value={brand.brandId}>
                                {brand.brandName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục
                    </label>
                    <select
                        value={filters.category}
                        onChange={(e) => onFilterChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        {PRODUCT_STATUS_OPTIONS.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Filter - THÊM LABEL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lọc theo ngày
                    </label>
                    <DateRangePicker
                        value={{
                            startDate: filters.startDate,
                            endDate: filters.endDate,
                            preset: filters.datePreset
                        }}
                        onChange={handleDateRangeChange}
                        placeholder="Chọn khoảng thời gian"
                        className="w-full"
                    />
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Xóa bộ lọc
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
