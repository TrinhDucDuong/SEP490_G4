import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const StoreSearch = ({ searchTerm, onSearchChange, filteredStoresCount }) => (
    <div className="space-y-4">
        <SearchBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            placeholder="Tìm kiếm theo tên hoặc địa chỉ cửa hàng..."
        />
        {searchTerm && (
            <div className="text-sm text-gray-600">
                Tìm thấy {filteredStoresCount} cửa hàng cho từ khóa "{searchTerm}"
            </div>
        )}
    </div>
);

export default StoreSearch;
