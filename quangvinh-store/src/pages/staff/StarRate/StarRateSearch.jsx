import React from 'react';
import { X } from 'lucide-react';
import { STAR_RATE_CONSTANTS } from '../../../utils/constants/StarRateConstants';

const StarRateSearch = ({
                            searchTerm,
                            onSearchChange,
                            searchType,
                            onSearchTypeChange,
                            onClearFilters
                        }) => {
    return (
        <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
                <input
                    type="text"
                    placeholder={
                        searchType === STAR_RATE_CONSTANTS.SEARCH_TYPES.USERNAME
                            ? "Tìm kiếm theo tên khách hàng..."
                            : "Tìm kiếm theo ID đánh giá..."
                    }
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                    </svg>
                </div>
            </div>

            <select
                value={searchType}
                onChange={(e) => onSearchTypeChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value={STAR_RATE_CONSTANTS.SEARCH_TYPES.USERNAME}>Tên khách hàng</option>
                <option value={STAR_RATE_CONSTANTS.SEARCH_TYPES.STAR_RATE_ID}>ID đánh giá</option>
            </select>

            <button
                onClick={onClearFilters}
                className="px-4 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                title="Xóa bộ lọc"
            >
                <X className="w-4 h-4" />
                <span>Xóa bộ lọc</span>
            </button>
        </div>
    );
};

export default StarRateSearch;
