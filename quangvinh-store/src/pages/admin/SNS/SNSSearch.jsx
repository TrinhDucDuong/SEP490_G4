import React from 'react';
import SearchBar from '../../../components/common/admin/SearchBar.jsx';

const SNSSearch = ({ searchTerm, onSearchChange, filteredSNSCount }) => {
    return (
        <div>
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm mạng xã hội..."
            />
            {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                    Tìm thấy {filteredSNSCount} mạng xã hội cho từ khóa "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default SNSSearch;
