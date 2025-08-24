import React from 'react';
import SearchBar from '../../../components/common/admin/SearchBar';

const StoreSearch = ({ searchTerm, onSearchChange, filteredStoresCount }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm cửa hàng..."
            />
            {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                    Tìm thấy {filteredStoresCount} cửa hàng cho từ khóa "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default StoreSearch;
