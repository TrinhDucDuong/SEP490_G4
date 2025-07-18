// src/pages/Staff/Product/ProductFilter.jsx

import React from 'react';
import { ChevronDown, X, Calendar, Filter } from 'lucide-react';
import DateRangePicker from '../../../components/common/Admin/DateRangePicker';
import { PRODUCT_STATUS_OPTIONS } from '../../../utils/constants/ProductConstants';

const ProductFilter = ({
                           filters,
                           onFilterChange,
                           onClearFilters,
                           brands,
                           categories
                       }) => {
    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="mb-6">
            <div className="bg-white rounded-lg shadow border">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <h3 className="text-lg font-medium text-gray-900">Bộ lọc sản phẩm</h3>
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={onClearFilters}
                                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Xóa tất cả bộ lọc
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Brand Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thương hiệu
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.brand}
                                    onChange={(e) => onFilterChange('brand', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                >
                                    <option value="">Tất cả thương hiệu</option>
                                    {brands.map(brand => (
                                        <option key={brand.brandId} value={brand.brandId}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {filters.brand && (
                                <div className="mt-1 text-xs text-blue-600">
                                    Đã chọn: {brands.find(b => b.brandId === parseInt(filters.brand))?.brandName}
                                </div>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.category}
                                    onChange={(e) => onFilterChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map(category => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {filters.category && (
                                <div className="mt-1 text-xs text-blue-600">
                                    Đã chọn: {categories.find(c => c.categoryId === parseInt(filters.category))?.categoryName}
                                </div>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.status}
                                    onChange={(e) => onFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    {PRODUCT_STATUS_OPTIONS.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {filters.status !== '' && (
                                <div className="mt-1 text-xs text-blue-600">
                                    Đã chọn: {PRODUCT_STATUS_OPTIONS.find(s => s.value.toString() === filters.status)?.label}
                                </div>
                            )}
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
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
                            {(filters.startDate && filters.endDate) && (
                                <div className="mt-1 text-xs text-blue-600">
                                    {new Date(filters.startDate).toLocaleDateString('vi-VN')} - {new Date(filters.endDate).toLocaleDateString('vi-VN')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>

                                {filters.brand && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Thương hiệu: {brands.find(b => b.brandId === parseInt(filters.brand))?.brandName}
                                        <button
                                            onClick={() => onFilterChange('brand', '')}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                                )}

                                {filters.category && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Danh mục: {categories.find(c => c.categoryId === parseInt(filters.category))?.categoryName}
                                        <button
                                            onClick={() => onFilterChange('category', '')}
                                            className="ml-1 text-green-600 hover:text-green-800"
                                        >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                                )}

                                {filters.status !== '' && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Trạng thái: {PRODUCT_STATUS_OPTIONS.find(s => s.value.toString() === filters.status)?.label}
                                        <button
                                            onClick={() => onFilterChange('status', '')}
                                            className="ml-1 text-purple-600 hover:text-purple-800"
                                        >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                                )}

                                {(filters.startDate && filters.endDate) && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Ngày: {new Date(filters.startDate).toLocaleDateString('vi-VN')} - {new Date(filters.endDate).toLocaleDateString('vi-VN')}
                                        <button
                                            onClick={() => {
                                                onFilterChange('startDate', '');
                                                onFilterChange('endDate', '');
                                                onFilterChange('datePreset', '');
                                            }}
                                            className="ml-1 text-orange-600 hover:text-orange-800"
                                        >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;
