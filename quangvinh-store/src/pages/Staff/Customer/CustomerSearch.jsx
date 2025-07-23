import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const CustomerSearch = ({ searchTerm, onSearchChange, filteredCustomersCount }) => {
    return (
        <div className="mb-6">
            <SearchBar
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={onSearchChange}
            />
            {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                    Tìm thấy {filteredCustomersCount} khách hàng cho từ khóa "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default CustomerSearch;
