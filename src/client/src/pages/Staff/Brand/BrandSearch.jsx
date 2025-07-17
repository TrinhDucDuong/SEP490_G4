import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const BrandSearch = ({ searchTerm, onSearchChange, filteredBrandsCount }) => {
    return (
        <div className="mb-6">
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm theo tên thương hiệu hoặc ID..."
            />

            {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                    Tìm thấy {filteredBrandsCount} thương hiệu cho từ khóa "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default BrandSearch;
