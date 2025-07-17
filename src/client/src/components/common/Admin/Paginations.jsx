import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Paginations = ({
                         currentPage,
                         totalPages,
                         totalItems,
                         itemsPerPage,
                         onPageChange,
                         itemName = "items"
                     }) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pageNumbers.push(i);
                }
            }
        }

        return pageNumbers;
    };

    return (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                {/* Thông tin tổng số */}
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-700">
                        <span className="hidden sm:inline">Hiển thị </span>
                        <span className="font-semibold">{indexOfFirstItem + 1}</span> - <span className="font-semibold">{Math.min(indexOfLastItem, totalItems)}</span>
                        <span className="hidden sm:inline"> trong tổng số</span> <span className="font-semibold">{totalItems}</span>
                        <span className="hidden sm:inline"> {itemName}</span>
                    </p>
                </div>

                {/* Phân trang */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                    {/* Đầu tiên */}
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="hidden sm:inline">Đầu</span>
                        <span className="sm:hidden">1</span>
                    </button>

                    {/* Trước */}
                    <button
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Trước</span>
                    </button>

                    {/* Số trang - desktop */}
                    <div className="hidden sm:flex items-center space-x-1">
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPage === pageNum
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    {/* Số trang - mobile */}
                    <div className="sm:hidden px-3 py-2 text-sm text-gray-600">
                        {currentPage} / {totalPages}
                    </div>

                    {/* Sau */}
                    <button
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="hidden sm:inline">Sau</span>
                        <ChevronRight className="h-4 w-4 sm:ml-1" />
                    </button>

                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="hidden sm:inline">Cuối</span>
                        <span className="sm:hidden">{totalPages}</span>
                    </button>

                    <div className="hidden sm:block ml-4 text-sm text-gray-600">
                        Trang {currentPage} / {totalPages}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Paginations;
