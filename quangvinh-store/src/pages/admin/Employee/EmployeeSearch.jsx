import React from 'react';
import SearchBar from '../../../components/common/admin/SearchBar';

const EmployeeSearch = ({ searchTerm, onSearchChange, filteredEmployeesCount }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Tìm kiếm nhân viên..."
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
