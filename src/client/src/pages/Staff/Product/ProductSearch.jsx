// src/pages/Staff/Product/ProductSearch.jsx

import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const ProductSearch = ({
                           searchTerm,
                           onSearchChange,
                           filteredProductsCount
                       }) => {
    return (
        <div className="mb-6">
            <div className="bg-white rounded-lg shadow border p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 w-full sm:max-w-md">
                        <SearchBar
                            value={searchTerm}
                            onChange={onSearchChange}
                            placeholder="Tìm kiếm theo tên sản phẩm, mã sản phẩm..."
                            className="w-full"
                        />
                    </div>

                    {searchTerm && (
                        <div className="text-sm text-gray-600 whitespace-nowrap">
                            Tìm thấy <span className="font-semibold text-blue-600">{filteredProductsCount}</span> sản phẩm
                            cho từ khóa "<span className="font-medium">{searchTerm}</span>"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductSearch;
