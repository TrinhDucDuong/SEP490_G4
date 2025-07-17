import React, { useState, useEffect } from 'react';
import { useStarRateManagement } from '../../../hooks/useStarRateManagement';
import StarRateSearch from './StarRateSearch';
import StarRateFilter from './StarRateFilter';
import StarRateSort from './StarRateSort';
import CommentCard from './components/CommentCard';
import Pagination from './components/StarRatePagination';
import { useAuthForManager } from '../../../context/AuthContextForManager';

const StarRateManagement = () => {
    const { isAuthenticated, loading: authLoading } = useAuthForManager();
    const [repliesData, setRepliesData] = useState({});

    const {
        starRates,
        allStarRates,
        loading,
        error,
        sortBy,
        setSortBy,
        filterBy,
        setFilterBy,
        replyStatusFilter,
        setReplyStatusFilter,
        visibilityFilter,
        setVisibilityFilter,
        dateRange,
        setDateRange,
        searchTerm,
        setSearchTerm,
        searchType,
        setSearchType,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        totalItems,
        fetchStarRateById,
        replyToStarRate,
        updateReply,
        toggleStarRateVisibility,
        clearAllFilters,
        clearError
    } = useStarRateManagement();

    // Apply reply status filter to current page data
    const applyReplyStatusFilter = (rates, repliesData, statusFilter) => {
        if (statusFilter === 'all') {
            return rates;
        }

        return rates.filter(rate => {
            const hasReply = repliesData[rate.starRateId]?.length > 0;
            if (statusFilter === 'replied') {
                return hasReply;
            } else if (statusFilter === 'not_replied') {
                return !hasReply;
            }
            return true;
        });
    };

    // Apply filters to display data
    const displayStarRates = applyReplyStatusFilter(starRates, repliesData, replyStatusFilter);

    // Fetch replies for each star rate
    useEffect(() => {
        const fetchReplies = async () => {
            const newRepliesData = {};

            for (const starRate of allStarRates) {
                try {
                    const response = await fetchStarRateById(starRate.starRateId);
                    newRepliesData[starRate.starRateId] = response.staffReplyStarRate || [];
                } catch (error) {
                    console.error(`Error fetching replies for ${starRate.starRateId}:`, error);
                    newRepliesData[starRate.starRateId] = [];
                }
            }

            setRepliesData(newRepliesData);
        };

        if (allStarRates.length > 0) {
            fetchReplies();
        }
    }, [allStarRates, fetchStarRateById]);

    const handleReply = async (starRateId, comment) => {
        try {
            await replyToStarRate({
                replyId: starRateId,
                comment: comment
            });

            // Refresh replies for this specific star rate
            const response = await fetchStarRateById(starRateId);
            setRepliesData(prev => ({
                ...prev,
                [starRateId]: response.staffReplyStarRate || []
            }));
        } catch (error) {
            console.error('Error replying to star rate:', error);
        }
    };

    const handleUpdateReply = async (replyId, comment) => {
        try {
            await updateReply(replyId, { comment });

            // Find which star rate this reply belongs to and refresh its replies
            for (const starRateId in repliesData) {
                const replies = repliesData[starRateId];
                if (replies.some(reply => reply.starRateId === replyId)) {
                    const response = await fetchStarRateById(parseInt(starRateId));
                    setRepliesData(prev => ({
                        ...prev,
                        [starRateId]: response.staffReplyStarRate || []
                    }));
                    break;
                }
            }
        } catch (error) {
            console.error('Error updating reply:', error);
        }
    };

    const handleToggleVisibility = async (starRateId, isVisible) => {
        try {
            await toggleStarRateVisibility(starRateId, isVisible);
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h2>
                    <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý đánh giá sản phẩm</h1>
                    <p className="mt-2 text-gray-600">
                        Quản lý và phản hồi các đánh giá của khách hàng về sản phẩm
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={clearError}
                                    className="inline-flex text-red-400 hover:text-red-600"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Tổng đánh giá</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Đánh giá trung bình</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {allStarRates.length > 0
                                        ? (allStarRates.reduce((sum, rate) => sum + rate.starRate, 0) / allStarRates.length).toFixed(1)
                                        : '0.0'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Chưa phản hồi</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {allStarRates.filter(rate => !repliesData[rate.starRateId]?.length).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Đã phản hồi</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {allStarRates.filter(rate => repliesData[rate.starRateId]?.length > 0).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Tìm kiếm</h3>
                    <StarRateSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        searchType={searchType}
                        onSearchTypeChange={setSearchType}
                        onClearFilters={clearAllFilters}
                    />
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Bộ lọc</h3>
                    <StarRateFilter
                        filterBy={filterBy}
                        onFilterChange={setFilterBy}
                        replyStatusFilter={replyStatusFilter}
                        onReplyStatusFilterChange={setReplyStatusFilter}
                        visibilityFilter={visibilityFilter}
                        onVisibilityFilterChange={setVisibilityFilter}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                    />
                </div>

                {/* Sort Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Sắp xếp</h3>
                    <StarRateSort
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                    />
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                )}

                {/* Empty State */}
                {!loading && displayStarRates.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586l-4 4z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đánh giá nào</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Chưa có đánh giá nào từ khách hàng hoặc không tìm thấy kết quả phù hợp.
                        </p>
                    </div>
                )}

                {/* Star Rates List */}
                {!loading && displayStarRates.length > 0 && (
                    <>
                        <div className="space-y-4">
                            {displayStarRates.map((starRate) => (
                                <CommentCard
                                    key={starRate.starRateId}
                                    starRate={starRate}
                                    hasReply={repliesData[starRate.starRateId]?.length > 0}
                                    replies={repliesData[starRate.starRateId] || []}
                                    onReply={handleReply}
                                    onToggleVisibility={handleToggleVisibility}
                                    onUpdateReply={handleUpdateReply}
                                    isVisible={starRate.isVisible !== false}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            itemName="đánh giá"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default StarRateManagement;
