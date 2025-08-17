import React from 'react';

const FilterBar = ({ filters, onFilterChange, filterConfigs }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filterConfigs.map((config, index) => (
                <select
                    key={index}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    value={filters[config.key] || ''}
                    onChange={(e) => onFilterChange(config.key, e.target.value)}
                >
                    <option value="">{config.label}</option>
                    {config.options.map((option, optIndex) => (
                        <option key={optIndex} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ))}
        </div>
    );
};

export default FilterBar;
