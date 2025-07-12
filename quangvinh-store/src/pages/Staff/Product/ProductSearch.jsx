// src/pages/Staff/Product/ProductSearch.jsx

import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const ProductSearch = ({ searchTerm, onSearchChange, filteredProductsCount }) => {
    return (
        <div className="mb-4">
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm theo tên sản phẩm, mã sản phẩm..."
            />
            {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                    Tìm thấy {filteredProductsCount} sản phẩm cho từ khóa "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default ProductSearch;
