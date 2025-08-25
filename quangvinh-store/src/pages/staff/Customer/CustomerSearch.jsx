import React from 'react';
import SearchBar from '../../../components/common/admin/SearchBar';

const CustomerSearch = ({ searchTerm, onSearchChange, filteredCustomersCount }) => {
    return (
        <div>
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm khách hàng theo tên, email, số điện thoại..."
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
