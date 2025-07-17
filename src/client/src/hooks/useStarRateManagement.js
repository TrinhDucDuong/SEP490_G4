import { useState, useEffect, useCallback } from 'react';
import { StarRateManagementAPI } from '../utils/api/Admin/StarRateManagementAPI';
import { STAR_RATE_CONSTANTS } from '../utils/constants/StarRateConstants';

export const useStarRateManagement = () => {
    const [starRates, setStarRates] = useState([]);
    const [filteredStarRates, setFilteredStarRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState(STAR_RATE_CONSTANTS.SORT_OPTIONS.CREATED_AT_DESC);
    const [filterBy, setFilterBy] = useState(STAR_RATE_CONSTANTS.FILTER_OPTIONS.ALL);
    const [replyStatusFilter, setReplyStatusFilter] = useState(STAR_RATE_CONSTANTS.REPLY_STATUS_FILTER.ALL);
    const [visibilityFilter, setVisibilityFilter] = useState(STAR_RATE_CONSTANTS.VISIBILITY_FILTER.ALL);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '', preset: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState(STAR_RATE_CONSTANTS.SEARCH_TYPES.USERNAME);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(STAR_RATE_CONSTANTS.ITEMS_PER_PAGE);

    // Fetch tất cả đánh giá
    const fetchStarRates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await StarRateManagementAPI.getAllStarRates();
            setStarRates(response.starRates || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching star rates:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch đánh giá theo ID
    const fetchStarRateById = useCallback(async (starRateId) => {
        try {
            const response = await StarRateManagementAPI.getStarRateById(starRateId);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Reply đánh giá
    const replyToStarRate = useCallback(async (replyData) => {
        try {
            const response = await StarRateManagementAPI.replyStarRate(replyData);
            await fetchStarRates(); // Refresh data
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [fetchStarRates]);

    // Cập nhật reply
    const updateReply = useCallback(async (starRateId, updateData) => {
        try {
            const response = await StarRateManagementAPI.updateReply(starRateId, updateData);
            await fetchStarRates(); // Refresh data
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [fetchStarRates]);

    // Ẩn/hiện đánh giá
    const toggleStarRateVisibility = useCallback(async (starRateId, isVisible) => {
        try {
            if (isVisible) {
                await StarRateManagementAPI.hideStarRate(starRateId);
            } else {
                await StarRateManagementAPI.restoreStarRate(starRateId);
            }
            await fetchStarRates(); // Refresh data
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [fetchStarRates]);

    // Sorting function
    const sortStarRates = useCallback((rates, sortOption) => {
        const sorted = [...rates].sort((a, b) => {
            switch (sortOption) {
                case STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ASC:
                    return a.starRate - b.starRate;
                case STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_DESC:
                    return b.starRate - a.starRate;
                case STAR_RATE_CONSTANTS.SORT_OPTIONS.CREATED_AT_ASC:
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case STAR_RATE_CONSTANTS.SORT_OPTIONS.CREATED_AT_DESC:
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ID_ASC:
                    return a.starRateId - b.starRateId;
                case STAR_RATE_CONSTANTS.SORT_OPTIONS.STAR_RATE_ID_DESC:
                    return b.starRateId - a.starRateId;
                default:
                    return 0;
            }
        });
        return sorted;
    }, []);

    // Filter function
    const filterStarRates = useCallback((rates, filterOption) => {
        if (filterOption === STAR_RATE_CONSTANTS.FILTER_OPTIONS.ALL) {
            return rates;
        }
        return rates.filter(rate => rate.starRate === filterOption);
    }, []);

    // Filter by reply status
    const filterByReplyStatus = useCallback((rates, repliesData, statusFilter) => {
        if (statusFilter === STAR_RATE_CONSTANTS.REPLY_STATUS_FILTER.ALL) {
            return rates;
        }

        return rates.filter(rate => {
            const hasReply = repliesData[rate.starRateId]?.length > 0;
            if (statusFilter === STAR_RATE_CONSTANTS.REPLY_STATUS_FILTER.REPLIED) {
                return hasReply;
            } else if (statusFilter === STAR_RATE_CONSTANTS.REPLY_STATUS_FILTER.NOT_REPLIED) {
                return !hasReply;
            }
            return true;
        });
    }, []);

    // Filter by visibility
    const filterByVisibility = useCallback((rates, visibilityOption) => {
        if (visibilityOption === STAR_RATE_CONSTANTS.VISIBILITY_FILTER.ALL) {
            return rates;
        }
        return rates.filter(rate => {
            if (visibilityOption === STAR_RATE_CONSTANTS.VISIBILITY_FILTER.VISIBLE) {
                return rate.isVisible !== false;
            } else if (visibilityOption === STAR_RATE_CONSTANTS.VISIBILITY_FILTER.HIDDEN) {
                return rate.isVisible === false;
            }
            return true;
        });
    }, []);

    // Filter by date range
    const filterByDateRange = useCallback((rates, dateRange) => {
        if (!dateRange.startDate || !dateRange.endDate) {
            return rates;
        }

        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);

        return rates.filter(rate => {
            const rateDate = new Date(rate.createdAt);
            return rateDate >= startDate && rateDate <= endDate;
        });
    }, []);

    // Search function
    const searchStarRates = useCallback((rates, term, type) => {
        if (!term.trim()) return rates;

        return rates.filter(rate => {
            if (type === STAR_RATE_CONSTANTS.SEARCH_TYPES.USERNAME) {
                return rate.account.username.toLowerCase().includes(term.toLowerCase());
            } else if (type === STAR_RATE_CONSTANTS.SEARCH_TYPES.STAR_RATE_ID) {
                return rate.starRateId.toString().includes(term);
            }
            return true;
        });
    }, []);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setSearchTerm('');
        setFilterBy(STAR_RATE_CONSTANTS.FILTER_OPTIONS.ALL);
        setReplyStatusFilter(STAR_RATE_CONSTANTS.REPLY_STATUS_FILTER.ALL);
        setVisibilityFilter(STAR_RATE_CONSTANTS.VISIBILITY_FILTER.ALL);
        setDateRange({ startDate: '', endDate: '', preset: '' });
        setCurrentPage(1);
    }, []);

    // Apply filters, search, and sort
    useEffect(() => {
        let processed = [...starRates];

        // Apply search
        processed = searchStarRates(processed, searchTerm, searchType);

        // Apply star rating filter
        processed = filterStarRates(processed, filterBy);

        // Apply visibility filter
        processed = filterByVisibility(processed, visibilityFilter);

        // Apply date range filter
        processed = filterByDateRange(processed, dateRange);

        // Apply sort
        processed = sortStarRates(processed, sortBy);

        setFilteredStarRates(processed);

        // Reset to first page when filters change
        setCurrentPage(1);
    }, [starRates, searchTerm, searchType, filterBy, visibilityFilter, dateRange, sortBy, replyStatusFilter, searchStarRates, filterStarRates, filterByVisibility, filterByDateRange, sortStarRates]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredStarRates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredStarRates.slice(startIndex, endIndex);

    // Initial fetch
    useEffect(() => {
        fetchStarRates();
    }, [fetchStarRates]);

    return {
        starRates: currentItems,
        allStarRates: filteredStarRates,
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
        totalItems: filteredStarRates.length,
        fetchStarRates,
        fetchStarRateById,
        replyToStarRate,
        updateReply,
        toggleStarRateVisibility,
        clearAllFilters,
        filterByReplyStatus,
        clearError: () => setError(null)
    };
};
