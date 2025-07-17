import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const PoliciesSearch = ({ searchTerm, onSearchChange, filteredPoliciesCount }) => {
    return (
        <div className="mb-6">
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                placeholder="Tìm kiếm chính sách..."
            />

            {searchTerm && (
                <div className="mt-2 text-sm text-gray-600">
                    Tìm thấy {filteredPoliciesCount} chính sách cho từ khóa "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default PoliciesSearch;
