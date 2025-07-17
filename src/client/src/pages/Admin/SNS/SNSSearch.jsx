// src/pages/Admin/SNS/SNSSearch.jsx
import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar.jsx';

const SNSSearch = ({ searchTerm, onSearchChange, filteredSNSCount }) => {
    return (
        <div className="space-y-4">
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                placeholder="Tìm kiếm theo tên mạng xã hội hoặc ID..."
            />
            {searchTerm && (
                <div className="text-sm text-gray-600">
                    Tìm thấy {filteredSNSCount} mạng xã hội cho từ khóa "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default SNSSearch;
