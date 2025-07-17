import React from 'react';
import DateRangePicker from '../../../components/common/Admin/DateRangePicker';
import { STAR_RATE_CONSTANTS } from '../../../utils/constants/StarRateConstants';

const StarRateFilter = ({
                            filterBy,
                            onFilterChange,
                            replyStatusFilter,
                            onReplyStatusFilterChange,
                            visibilityFilter,
                            onVisibilityFilterChange,
                            dateRange,
                            onDateRangeChange
                        }) => {
    const filterOptions = [
        { value: STAR_RATE_CONSTANTS.FILTER_OPTIONS.ALL, label: 'Tất cả đánh giá' },
        { value: STAR_RATE_CONSTANTS.FILTER_OPTIONS.ONE_STAR, label: '1 sao' },
        { value: STAR_RATE_CONSTANTS.FILTER_OPTIONS.TWO_STAR, label: '2 sao' },
        { value: STAR_RATE_CONSTANTS.FILTER_OPTIONS.THREE_STAR, label: '3 sao' },
        { value: STAR_RATE_CONSTANTS.FILTER_OPTIONS.FOUR_STAR, label: '4 sao' },
        { value: STAR_RATE_CONSTANTS.FILTER_OPTIONS.FIVE_STAR, label: '5 sao' }
    ];

    const replyStatusOptions = [
        { value: STAR_RATE_CONSTANTS.REPLY_STATUS_FILTER.ALL, label: 'Tất cả' },
        { value: STAR_RATE_CONSTANTS.REPLY_STATUS_FILTER.REPLIED, label: 'Đã phản hồi' },
        { value: STAR_RATE_CONSTANTS.REPLY_STATUS_FILTER.NOT_REPLIED, label: 'Chưa phản hồi' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filter by star rating */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo số sao:
                </label>
                <select
                    value={filterBy}
                    onChange={(e) => onFilterChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                    {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filter by reply status */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo tình trạng phản hồi:
                </label>
                <select
                    value={replyStatusFilter}
                    onChange={(e) => onReplyStatusFilterChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                    {replyStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filter by visibility */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo trạng thái hiển thị:
                </label>
                <select
                    value={visibilityFilter}
                    onChange={(e) => onVisibilityFilterChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                >
                    <option value="all">Tất cả</option>
                    <option value="visible">Đang hiển thị</option>
                    <option value="hidden">Đang ẩn</option>
                </select>
            </div>

            {/* Filter by date range */}
            <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                    Lọc theo ngày đánh giá
                </div>
                <DateRangePicker
                    value={dateRange}
                    onChange={onDateRangeChange}
                    label="Lọc theo ngày"
                    placeholder="Chọn khoảng thời gian"
                />
            </div>
        </div>
    );
};

export default StarRateFilter;
