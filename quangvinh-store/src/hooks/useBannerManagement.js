import { useState, useEffect } from 'react';
import { getAllBanners, createBanner, updateBannerStatus } from '../utils/api/Admin/BannerManagementAPI.js';
import { BANNER_HELPERS, BANNER_DEFAULTS } from '../utils/constants/BannerConstants';

export const useBannerManagement = () => {
    // Data state
    const [banners, setBanners] = useState([]);
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = BANNER_DEFAULTS.ITEMS_PER_PAGE;

    // filter state
    const [filters, setFilters] = useState(BANNER_DEFAULTS.DEFAULT_FILTER);

    // Status change tracking - FIXED logic
    const [statusChanges, setStatusChanges] = useState({
        activeIds: [],
        deActiveIds: []
    });

    // Original banners state để track thay đổi
    const [originalBanners, setOriginalBanners] = useState([]);

    // Fetch banners from API
    const fetchBanners = async (keepCurrentPage = false) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllBanners();
            if (result.success) {
                // SẮP XẾP BANNER MỚI LÊN TRƯỚC (theo imageId giảm dần)
                const sortedBanners = result.data.sort((a, b) => b.imageId - a.imageId);
                setBanners(sortedBanners);
                setOriginalBanners(sortedBanners);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu banner');
        } finally {
            setLoading(false);
        }
    };

    // Create banner
    const createBannerHandler = async (bannerImages) => {
        setLoading(true);
        try {
            const result = await createBanner(bannerImages);
            if (result.success) {
                // Refresh data và GIỮ NGUYÊN TRANG HIỆN TẠI
                await fetchBanners(true);
                // Chuyển về trang 1 để xem banner mới tạo (vì banner mới sẽ ở đầu)
                setCurrentPage(1);
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi tạo banner' };
        } finally {
            setLoading(false);
        }
    };

    // Update banner status
    const updateBannerStatusHandler = async () => {
        setLoading(true);
        try {
            // Prepare request body theo format API
            const requestBody = {
                deActiveIds: statusChanges.deActiveIds.length > 0 ? statusChanges.deActiveIds : [0],
                activeIds: statusChanges.activeIds.length > 0 ? statusChanges.activeIds : [0]
            };

            const result = await updateBannerStatus(requestBody);
            if (result.success) {
                // Refresh data
                await fetchBanners(true);
                setStatusChanges({ activeIds: [], deActiveIds: [] }); // Reset changes
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật trạng thái banner' };
        } finally {
            setLoading(false);
        }
    };

    // Toggle banner status
    const toggleBannerStatus = (bannerId, currentStatus) => {
        // Update UI immediately với SẮP XẾP GIỐNG NHAU
        setBanners(prev => {
            const updatedBanners = prev.map(banner =>
                banner.imageId === bannerId
                    ? { ...banner, isActive: !currentStatus }
                    : banner
            );
            return updatedBanners.sort((a, b) => b.imageId - a.imageId);
        });

        // Track changes for API call
        setStatusChanges(prev => {
            const newChanges = { ...prev };

            if (currentStatus) {
                // Currently active -> deactivate
                // Remove from activeIds if exists
                newChanges.activeIds = newChanges.activeIds.filter(id => id !== bannerId);
                // Add to deActiveIds if not exists
                if (!newChanges.deActiveIds.includes(bannerId)) {
                    newChanges.deActiveIds = [...newChanges.deActiveIds, bannerId];
                }
            } else {
                // Currently inactive -> activate
                // Remove from deActiveIds if exists
                newChanges.deActiveIds = newChanges.deActiveIds.filter(id => id !== bannerId);
                // Add to activeIds if not exists
                if (!newChanges.activeIds.includes(bannerId)) {
                    newChanges.activeIds = [...newChanges.activeIds, bannerId];
                }
            }

            return newChanges;
        });
    };

    // Reset status changes
    const resetStatusChanges = () => {
        setStatusChanges({ activeIds: [], deActiveIds: [] });
        const sortedOriginal = [...originalBanners].sort((a, b) => b.imageId - a.imageId);
        setBanners(sortedOriginal);
    };

    // Check if there are pending status changes
    const hasPendingChanges = () => {
        return BANNER_HELPERS.hasStatusChanges(statusChanges.activeIds, statusChanges.deActiveIds);
    };

    // filter banners
    useEffect(() => {
        let result = [...banners];

        // filter by status
        if (filters.status !== '') {
            const isActive = filters.status === 'true';
            result = result.filter(banner => banner.isActive === isActive);
        }

        setFilteredBanners(result);

        const shouldResetPage = JSON.stringify(filters) !== JSON.stringify(BANNER_DEFAULTS.DEFAULT_FILTER);
        if (shouldResetPage) {
            setCurrentPage(1);
        }
    }, [banners, filters]);

    // Handle filter change
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1);
    };

    // Clear filters
    const clearFilters = () => {
        setFilters(BANNER_DEFAULTS.DEFAULT_FILTER);
        setCurrentPage(1);
    };

    // Get statistics
    const getStatistics = () => {
        const totalBanners = banners.length;
        const activeBanners = banners.filter(banner => banner.isActive).length;
        const inactiveBanners = banners.filter(banner => !banner.isActive).length;
        const filteredCount = filteredBanners.length;

        return {
            totalBanners,
            activeBanners,
            inactiveBanners,
            filteredCount
        };
    };

    // Get paginated banners
    const getPaginatedBanners = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredBanners.slice(startIndex, endIndex);
    };

    // Get total pages
    const getTotalPages = () => {
        return Math.ceil(filteredBanners.length / itemsPerPage);
    };

    // Load data on mount
    useEffect(() => {
        fetchBanners();
    }, []);

    return {
        // Data
        banners,
        filteredBanners,
        paginatedBanners: getPaginatedBanners(),
        loading,
        error,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalPages: getTotalPages(),

        // filter
        filters,
        handleFilterChange,
        clearFilters,

        // Status changes
        statusChanges,
        toggleBannerStatus,
        resetStatusChanges,
        hasPendingChanges: hasPendingChanges(),

        // Actions
        fetchBanners,
        createBanner: createBannerHandler,
        updateBannerStatus: updateBannerStatusHandler,

        // Utilities
        getStatistics
    };
};
