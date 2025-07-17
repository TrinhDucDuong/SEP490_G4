// src/pages/Staff/Category/CategorySearch.jsx
import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const CategorySearch = ({ searchTerm, onSearchChange, filteredCategoriesCount }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm theo tên danh mục, danh mục cha, người tạo..."
            />
            {searchTerm && (
                <p className="mt-2 text-sm text-gray-600">
                    Tìm thấy {filteredCategoriesCount} danh mục cho từ khóa "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default CategorySearch;
