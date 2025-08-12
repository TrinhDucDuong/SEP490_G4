import React from 'react';
import { ChevronDown } from 'lucide-react';
import { DASHBOARD_CONSTANTS } from '../../../../utils/constants/DashboardConstants';

const FilterDropdown = ({ value, onChange, className = "" }) => {
    const options = [
        { value: DASHBOARD_CONSTANTS.FILTER_OPTIONS.WEEK, label: 'Tuần' },
        { value: DASHBOARD_CONSTANTS.FILTER_OPTIONS.MONTH, label: 'Tháng' },
        { value: DASHBOARD_CONSTANTS.FILTER_OPTIONS.YEAR, label: 'Năm' }
    ];

    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
    );
};

export default FilterDropdown;
