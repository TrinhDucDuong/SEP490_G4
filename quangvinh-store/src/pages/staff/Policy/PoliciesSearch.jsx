import React from 'react';
import SearchBar from '../../../components/common/admin/SearchBar';

const PoliciesSearch = ({ searchTerm, onSearchChange, filteredPoliciesCount }) => {
    return (
        <div className="flex flex-col gap-4 mb-6">
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm chính sách..."
                className="w-full"
            />

            {searchTerm && (
                <div className="text-sm text-gray-600">
                    Tìm thấy {filteredPoliciesCount} kết quả cho "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default PoliciesSearch;
