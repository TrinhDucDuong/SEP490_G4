import React from 'react';
import SearchBar from '../../../components/common/admin/SearchBar';

const InstructionSearch = ({ searchTerm, onSearchChange, filteredInstructionsCount }) => {
    return (
        <div className="mb-6">
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm theo tên hướng dẫn, ID hoặc mô tả..."
                className="w-full"
            />
            {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                    Tìm thấy {filteredInstructionsCount} kết quả cho "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default InstructionSearch;
