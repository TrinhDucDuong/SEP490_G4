// src/components/common/Admin/SearchBar.jsx

import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
                       value,
                       onChange,
                       placeholder = "Tìm kiếm...",
                       className = "",
                       onClear
                   }) => {
    const handleClear = () => {
        onChange('');
        if (onClear) onClear();
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder={placeholder}
            />
            {value && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
