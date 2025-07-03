import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SortButton = ({ active, onClick, label, shortLabel }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                active
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
        >
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
            {shortLabel && <span className="sm:hidden">{shortLabel}</span>}
        </button>
    );
};

export default SortButton;
