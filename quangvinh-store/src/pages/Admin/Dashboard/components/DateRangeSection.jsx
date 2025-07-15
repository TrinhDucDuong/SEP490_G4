import React, { useState, useEffect } from 'react';
import DateRangePicker from '../../../../components/common/Admin/DateRangePicker';

const DateRangeSection = ({ onDateRangeChange, children }) => {
    const [dateRange, setDateRange] = useState(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            preset: 'custom'
        };
    });

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const startTime = new Date(dateRange.startDate).toISOString();
            const endTime = new Date(dateRange.endDate).toISOString();
            onDateRangeChange(startTime, endTime, dateRange);
        }
    }, [dateRange, onDateRangeChange]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Biểu đồ chi tiết</h2>
                <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Chọn khoảng thời gian"
                    className="w-64"
                />
            </div>
            {children}
        </div>
    );
};

export default DateRangeSection;
