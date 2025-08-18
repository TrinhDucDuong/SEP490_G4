// src/pages/Staff/Instruction/InstructionManagement.jsx
import React from 'react';
import InstructionSearch from './InstructionSearch';
import InstructionFilter from './InstructionFilter';
import InstructionSort from './InstructionSort';
import InstructionTable from './InstructionTable';
import { useInstructionManagement } from '../../../hooks/useInstructionManagement';

const InstructionManagement = () => {
    const {
        // Data
        filteredInstructions,
        loading,
        error,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,

        // Search, filter, Sort
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,

        // Actions
        fetchInstructions,
        createInstruction,
        updateInstruction,
        deleteInstruction,

        // Utilities
        clearFilters,
        getStatistics
    } = useInstructionManagement();

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

    // Get paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedInstructions = filteredInstructions.slice(startIndex, endIndex);

    // Get statistics
    const stats = getStatistics();

    // Error handling
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Quản lý hướng dẫn
                </h1>
                <p className="text-gray-600">
                    Quản lý các hướng dẫn cho khách hàng
                </p>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-700">Tổng hướng dẫn</h3>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalInstructions}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-green-700">Kết quả lọc</h3>
                        <p className="text-2xl font-bold text-green-900">{stats.filteredCount}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-purple-700">Hiển thị trên trang</h3>
                        <p className="text-2xl font-bold text-purple-900">{paginatedInstructions.length}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <InstructionSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filteredInstructionsCount={stats.filteredCount}
            />

            {/* Filter */}
            <InstructionFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />

            {/* Sort */}
            <InstructionSort
                sortConfig={sortConfig}
                onSort={handleSort}
            />

            {/* Table */}
            <InstructionTable
                instructions={paginatedInstructions}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredInstructions.length}
                totalPages={Math.ceil(filteredInstructions.length / itemsPerPage)}
                onCreateInstruction={createInstruction}
                onUpdateInstruction={updateInstruction}
                onDeleteInstruction={deleteInstruction}
                loading={loading}
            />
        </div>
    );
};

export default InstructionManagement;
