import React from 'react';
import SearchBar from '../../../components/common/SearchBar';

const ProductSearch = ({ searchTerm, onSearchChange, filteredProductsCount }) => {
    return (
        <div className="mb-6">
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm theo tên sản phẩm hoặc mã sản phẩm..."
                className="w-full"
            />

            {searchTerm && (
                <div className="mt-2 text-sm text-gray-600">
                    Tìm thấy {filteredProductsCount} sản phẩm cho từ khóa "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
