import React from 'react';
import EmployeeSearch from './EmployeeSearch';
import EmployeeFilter from './EmployeeFilter';
import EmployeeSort from './EmployeeSort';
import EmployeeTable from './EmployeeTable.jsx';
import { useEmployeeManagement } from '../../../hooks/useEmployeeManagement';

const EmployeeManagement = () => {
    const {
        // Data
        employees,
        filteredEmployees,
        stores,
        loading,
        error,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,

        // Search, Filter, Sort
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,

        // Actions
        fetchEmployees,
        createEmployee,
        deleteEmployee,
        activateEmployee,

        // Utilities
        clearFilters,
        getStatistics
    } = useEmployeeManagement();

    // Handler functions
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleClearFilters = () => {
        clearFilters();
    };

    const statistics = getStatistics();

    // Error handling
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">❌ Có lỗi xảy ra</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchEmployees}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Quản lý nhân viên
                </h1>
                <p className="text-gray-600">
                    Quản lý thông tin và hoạt động của nhân viên
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-500">Tổng nhân viên</div>
                    <div className="text-2xl font-bold text-gray-800">
                        {statistics.totalEmployees}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-500">Đang hoạt động</div>
                    <div className="text-2xl font-bold text-green-600">
                        {statistics.activeEmployees}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-500">Ngừng hoạt động</div>
                    <div className="text-2xl font-bold text-red-600">
                        {statistics.inactiveEmployees}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-500">Kết quả lọc</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {statistics.filteredCount}
                    </div>
                </div>
            </div>

            {/* Search, Filter, Sort */}
            <div className="space-y-4 mb-6">
                <EmployeeSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filteredEmployeesCount={filteredEmployees.length}
                />

                <div className="flex flex-wrap gap-4">
                    <EmployeeFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />

                    <EmployeeSort
                        sortConfig={sortConfig}
                        onSort={handleSort}
                    />
                </div>
            </div>

            {/* Employee Table */}
            <EmployeeTable
                employees={filteredEmployees}
                stores={stores}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onCreateEmployee={createEmployee}
                onDeleteEmployee={deleteEmployee}
                onActivateEmployee={activateEmployee}
                loading={loading}
            />
        </div>
    );
};

export default EmployeeManagement;
