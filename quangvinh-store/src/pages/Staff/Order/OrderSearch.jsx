// src/pages/Staff/Order/OrderSearch.jsx
import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const OrderSearch = ({ searchTerm, onSearchChange, filteredOrdersCount }) => {
    return (
        <div className="space-y-4">
            <SearchBar
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, email..."
                value={searchTerm}
                onChange={onSearchChange}
            />

            {searchTerm && (
                <div className="text-sm text-gray-600">
                    Tìm thấy <span className="font-semibold">{filteredOrdersCount}</span> đơn hàng
                    cho từ khóa "<span className="font-semibold">{searchTerm}</span>"
                </div>
            )}
        </div>
    );
};

export default OrderSearch;
