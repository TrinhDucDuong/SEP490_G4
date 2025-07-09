import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const DateRangePicker = ({
                             value,
                             onChange,
                             label = "Lọc theo ngày",
                             placeholder = "Chọn khoảng thời gian",
                             className = "",
                             disabled = false
                         }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState(value?.preset || '');
    const [customStartDate, setCustomStartDate] = useState(value?.startDate || '');
    const [customEndDate, setCustomEndDate] = useState(value?.endDate || '');
    const [currentMonth, setCurrentMonth] = useState(
        value?.startDate ? new Date(value.startDate) : new Date()
    );

    // Keep internal state synchronized with external value
    useEffect(() => {
        setSelectedRange(value?.preset || '');
        setCustomStartDate(value?.startDate || '');
        setCustomEndDate(value?.endDate || '');

        if (value?.startDate) {
            setCurrentMonth(new Date(value.startDate));
        }
    }, [value]);

    const presetOptions = [
        { label: 'Hôm nay', value: 'today' },
        { label: 'Hôm qua', value: 'yesterday' },
        { label: '7 ngày trước tới hôm nay', value: '7days' },
        { label: '7 ngày trước tới hôm qua', value: '7days_yesterday' },
        { label: '30 ngày trước tới hôm nay', value: '30days' },
        { label: '30 ngày trước tới hôm qua', value: '30days_yesterday' },
        { label: 'Tháng này', value: 'this_month' },
        { label: 'Tháng trước', value: 'last_month' },
        { label: '6 tháng trước tới hôm qua', value: '6months' },
        { label: 'Ngày tùy chọn', value: 'custom' }
    ];

    const getDateRange = (option) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (option === 'today') {
            return { start: today, end: today };
        }

        if (option === 'yesterday') {
            return { start: yesterday, end: yesterday };
        }

        if (option === '7days') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return { start: sevenDaysAgo, end: today };
        }

        if (option === '7days_yesterday') {
            const sevenDaysAgoYesterday = new Date(yesterday);
            sevenDaysAgoYesterday.setDate(sevenDaysAgoYesterday.getDate() - 7);
            return { start: sevenDaysAgoYesterday, end: yesterday };
        }

        if (option === '30days') {
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return { start: thirtyDaysAgo, end: today };
        }

        if (option === '30days_yesterday') {
            const thirtyDaysAgoYesterday = new Date(yesterday);
            thirtyDaysAgoYesterday.setDate(thirtyDaysAgoYesterday.getDate() - 30);
            return { start: thirtyDaysAgoYesterday, end: yesterday };
        }

        if (option === 'this_month') {
            const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            return { start: firstDayThisMonth, end: today };
        }

        if (option === 'last_month') {
            const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            return { start: firstDayLastMonth, end: lastDayLastMonth };
        }

        if (option === '6months') {
            const sixMonthsAgo = new Date(today);
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return { start: sixMonthsAgo, end: yesterday };
        }

        return null;
    };

    const handlePresetClick = (option) => {
        setSelectedRange(option);
        if (option !== 'custom') {
            const range = getDateRange(option);
            if (range) {
                const newValue = {
                    startDate: range.start.toISOString().split('T')[0],
                    endDate: range.end.toISOString().split('T')[0],
                    preset: option
                };
                onChange(newValue);
                setCustomStartDate('');
                setCustomEndDate('');
            }
        } else {
            // Reset custom dates when selecting custom option
            setCustomStartDate('');
            setCustomEndDate('');
        }
    };

    const handleCustomDateChange = () => {
        if (customStartDate && customEndDate) {
            // Make sure startDate is before or equal to endDate
            const startDate = new Date(customStartDate);
            const endDate = new Date(customEndDate);

            const newValue = {
                startDate: startDate <= endDate ? customStartDate : customEndDate,
                endDate: startDate <= endDate ? customEndDate : customStartDate,
                preset: 'custom'
            };
            onChange(newValue);
        } else if (customStartDate) {
            // If only start date is selected, use it for both start and end
            const newValue = {
                startDate: customStartDate,
                endDate: customStartDate,
                preset: 'custom'
            };
            onChange(newValue);
        }
    };

    const formatDateRange = (range) => {
        if (!range || (!range.startDate && !range.endDate)) {
            return placeholder;
        }

        const start = new Date(range.startDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const end = new Date(range.endDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        if (range.startDate === range.endDate) {
            return start;
        }

        return `${start} - ${end}`;
    };


    const generateCalendar = (month) => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    // const clearFilter = (e) => {
    //     e.stopPropagation();
    //     onChange({ startDate: '', endDate: '', preset: '' });
    //     setSelectedRange('');
    //     setCustomStartDate('');
    //     setCustomEndDate('');
    // };

    const handlePrevMonth = () => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        setCurrentMonth(newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        setCurrentMonth(newMonth);
    };

    const handleApply = () => {
        if (selectedRange === 'custom') {
            handleCustomDateChange();
        } else if (selectedRange && !customStartDate && !customEndDate) {
            // If a preset is selected but no custom dates, reapply the preset
            const range = getDateRange(selectedRange);
            if (range) {
                const newValue = {
                    startDate: range.start.toISOString().split('T')[0],
                    endDate: range.end.toISOString().split('T')[0],
                    preset: selectedRange
                };
                onChange(newValue);
            }
        }
        setShowPicker(false);
    };

    return (
        <>
            {/* Date Filter Button - SỬA LẠI ĐỂ BỚT KHOẢNG TRẮNG */}
            <div className={`relative ${className}`}>
                <button
                    type="button"
                    onClick={() => !disabled && setShowPicker(true)}
                    disabled={disabled}
                    className={`flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer hover:bg-gray-50 transition-colors w-full h-10 ${
                        disabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="flex-1 text-left truncate text-gray-700">
            {formatDateRange(value)}
        </span>
                    <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Date Picker Modals */}
            {showPicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
                        <div className="flex h-[600px]">
                            {/* Left Panel - Preset Options */}
                            <div className="w-2/5 border-r border-gray-200 p-4 overflow-y-auto">
                                <h3 className="font-semibold text-gray-900 mb-4">Tùy chọn</h3>
                                <div className="space-y-2">
                                    {presetOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handlePresetClick(option.value)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                selectedRange === option.value
                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Date Inputs - SỬA LẠI */}
                                {selectedRange === 'custom' && (
                                    <div className="mt-6 space-y-4 p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                                            <input
                                                type="date"
                                                value={customStartDate}
                                                onChange={(e) => setCustomStartDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                                            <input
                                                type="date"
                                                value={customEndDate}
                                                onChange={(e) => setCustomEndDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Panel - Calendar */}
                            <div className="w-3/5 p-4 overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Ngày tùy chọn</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowPicker(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Calendar Navigation */}
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        type="button"
                                        onClick={handlePrevMonth}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        ←
                                    </button>
                                    <span className="font-medium">
                                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleNextMonth}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        →
                                    </button>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 mb-2 text-center">
                                    {weekDays.map(day => (
                                        <div key={day} className="text-xs font-medium text-gray-600 py-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {generateCalendar(currentMonth).map((day, index) => (
                                        <div key={index} className="flex justify-center items-center p-1">
                                            {day ? (
                                                <button
                                                    type="button"
                                                    className={`h-10 w-10 text-sm rounded-lg transition-colors flex items-center justify-center
                                                        ${day ? 'hover:bg-blue-100 text-gray-900' : 'cursor-default'}
                                                        ${customStartDate && (() => {
                                                            // Tạo chuỗi ngày trực tiếp để so sánh
                                                            const year = currentMonth.getFullYear();
                                                            const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
                                                            const dayStr = String(day).padStart(2, '0');
                                                            const dateString = `${year}-${month}-${dayStr}`;
                                                            return dateString === customStartDate;
                                                        })() ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                                                        ${customEndDate && (() => {
                                                            // Tạo chuỗi ngày trực tiếp để so sánh
                                                            const year = currentMonth.getFullYear();
                                                            const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
                                                            const dayStr = String(day).padStart(2, '0');
                                                            const dateString = `${year}-${month}-${dayStr}`;
                                                            return dateString === customEndDate;
                                                        })() ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                                                    `}
                                                    onClick={() => {
                                                        if (day) {
                                                            // Tạo chuỗi ngày trực tiếp để tránh lỗi múi giờ
                                                            const year = currentMonth.getFullYear();
                                                            const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
                                                            const dayStr = String(day).padStart(2, '0');
                                                            const dateString = `${year}-${month}-${dayStr}`;
                                                            setSelectedRange('custom'); // Automatically set to custom when clicking calendar

                                                            if (!customStartDate || (customStartDate && customEndDate)) {
                                                                // Start a new selection
                                                                setCustomStartDate(dateString);
                                                                setCustomEndDate('');
                                                            } else if (customStartDate && !customEndDate) {
                                                                // Complete the selection
                                                                const startDate = new Date(customStartDate);
                                                                // Tạo đối tượng Date từ chuỗi dateString với múi giờ cục bộ
                                                                const selectedDate = new Date(`${dateString}T00:00:00`);

                                                                if (selectedDate >= startDate) {
                                                                    setCustomEndDate(dateString);
                                                                } else {
                                                                    // If selected date is before start date, swap them
                                                                    setCustomEndDate(customStartDate);
                                                                    setCustomStartDate(dateString);
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {day}
                                                </button>
                                            ) : <div className="h-10 w-10"></div>}
                                        </div>
                                    ))}
                                </div>

                                {/* Date Range Display */}
                                {(customStartDate || customEndDate) && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <h4 className="text-sm font-medium text-blue-800 mb-2">Khoảng thời gian đã chọn:</h4>
                                        <div className="flex items-center text-blue-700">
                                            <span className="font-medium">
                                                {customStartDate && new Date(customStartDate).toLocaleDateString('vi-VN')}
                                            </span>
                                            {customStartDate && customEndDate && (
                                                <span className="mx-2 text-blue-400">→</span>
                                            )}
                                            <span className="font-medium">
                                                {customEndDate && new Date(customEndDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowPicker(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleApply}
                                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DateRangePicker;
