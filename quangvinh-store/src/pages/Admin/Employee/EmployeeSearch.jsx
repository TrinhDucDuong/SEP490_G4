import React from 'react';
import SearchBar from '../../../components/common/Admin/SearchBar';

const EmployeeSearch = ({ searchTerm, onSearchChange, filteredEmployeesCount }) => {
    return (
        <div>
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                placeholder="Tìm kiếm theo tên nhân viên, tên tài khoản..."
            />
            {searchTerm && (
                <p className="text-sm text-gray-600 mt-2">
                    Tìm thấy {filteredEmployeesCount} nhân viên cho từ khóa "{searchTerm}"
                </p>
            )}
        </div>
    );
};

export default EmployeeSearch;
