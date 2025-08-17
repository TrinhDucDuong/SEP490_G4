import React from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

const CustomerSort = ({ sortConfig, onSort }) => {
    const sortOptions = [
        { key: 'fullName', label: 'Tên khách hàng' },
        { key: 'accountId', label: 'ID khách hàng' },
        { key: 'email', label: 'Email' },
        { key: 'phoneNumber', label: 'Số điện thoại' }
    ];

    const handleSort = (key) => {
        onSort(key);
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                    <button
                        key={option.key}
                        onClick={() => handleSort(option.key)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            sortConfig.key === option.key
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {option.label}
                        {sortConfig.key === option.key && (
                            <span className="ml-1">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CustomerSort;
