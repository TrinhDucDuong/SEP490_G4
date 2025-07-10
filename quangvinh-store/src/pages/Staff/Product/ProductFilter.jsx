import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import DateRangePicker from '../../../components/common/DateRangePicker';
import {
    PRODUCT_COLOR_OPTIONS,
    PRODUCT_SIZE_OPTIONS,
    PRODUCT_BRAND_OPTIONS,
    PRODUCT_STATUS_OPTIONS
} from '../../../utils/constants';

const ProductFilter = ({ filters, onFilterChange, onClearFilters }) => {
    const [showColorFilter, setShowColorFilter] = useState(false);

    const colorOptions = PRODUCT_COLOR_OPTIONS;
    const sizeOptions = PRODUCT_SIZE_OPTIONS;
    const brandOptions = PRODUCT_BRAND_OPTIONS;
    const statusOptions = PRODUCT_STATUS_OPTIONS.map(s => s.value);

    const handleDateRangeChange = (dateRange) => {
        onFilterChange('startDate', dateRange.startDate);
        onFilterChange('endDate', dateRange.endDate);
        onFilterChange('datePreset', dateRange.preset);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
                {/* Brand Filter */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                    <select
                        value={filters.brand}
                        onChange={(e) => onFilterChange('brand', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả thương hiệu</option>
                        {brandOptions.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                {/* Color Filter */}
                <div className="flex flex-col relative">
                    <label className="text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                    <button
                        onClick={() => setShowColorFilter(!showColorFilter)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between min-w-[120px]"
                    >
                        <span>{filters.color ? colorOptions.find(c => c.hex === filters.color)?.name : 'Tất cả màu'}</span>
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    {showColorFilter && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-2 min-w-[200px]">
                            <div
                                className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
                                onClick={() => {
                                    onFilterChange('color', '');
                                    setShowColorFilter(false);
                                }}
                            >
                                <span>Tất cả màu</span>
                            </div>
                            {colorOptions.map(color => (
                                <div
                                    key={color.hex}
                                    className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
                                    onClick={() => {
                                        onFilterChange('color', color.hex);
                                        setShowColorFilter(false);
                                    }}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <span>{color.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Size Filter */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Kích thước</label>
                    <select
                        value={filters.size}
                        onChange={(e) => onFilterChange('size', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả kích thước</option>
                        {sizeOptions.map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {/* Date Range Filter */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
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

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <div className="flex flex-col justify-end">
                        <button
                            onClick={onClearFilters}
                            className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductFilter;
