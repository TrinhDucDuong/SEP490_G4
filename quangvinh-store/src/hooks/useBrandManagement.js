import { useState, useEffect } from 'react';
import { getAllBrands, createBrand, updateBrand, deleteBrand } from '../utils/api/Admin/BrandManagementAPI.js';
import { BRAND_HELPERS } from '../utils/constants/BrandConstants';

export const useBrandManagement = () => {
    // Data state
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, Filter, Sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        datePreset: ''
    });
    // UPDATED: Mặc định sort theo ngày tạo mới nhất để sản phẩm mới lên đầu
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Fetch brands from API
    const fetchBrands = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getAllBrands();
            if (result.success) {
                setBrands(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Create brand
    const createBrandHandler = async (brandData, brandImage) => {
        setLoading(true);
        try {
            const result = await createBrand(brandData, brandImage);
            if (result.success) {
                await fetchBrands(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi tạo thương hiệu' };
        } finally {
            setLoading(false);
        }
    };

    // Update brand
    const updateBrandHandler = async (brandId, brandData, brandImage) => {
        setLoading(true);
        try {
            const result = await updateBrand(brandId, brandData, brandImage);
            if (result.success) {
                await fetchBrands(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật thương hiệu' };
        } finally {
            setLoading(false);
        }
    };

    // Delete brand
    const deleteBrandHandler = async (brandId) => {
        setLoading(true);
        try {
            const result = await deleteBrand(brandId);
            if (result.success) {
                await fetchBrands(); // Refresh data
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi xóa thương hiệu' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic - UPDATED for new API structure
    useEffect(() => {
        let result = [...brands];

        // Search - updated to handle nested objects
        if (searchTerm) {
            result = result.filter(brand =>
                brand.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.brandId.toString().includes(searchTerm) ||
                BRAND_HELPERS.getUsername(brand.createdBy).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (filters.status !== '') {
            const isActive = filters.status === 'true';
            result = result.filter(brand => brand.isActive === isActive);
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            result = result.filter(brand => {
                const createdDate = new Date(brand.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            });
        }

        // Sort - UPDATED để mặc định sort theo ngày tạo mới nhất
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'brandName':
                        aValue = a.brandName.toLowerCase();
                        bValue = b.brandName.toLowerCase();
                        break;
                    case 'brandId':
                        aValue = a.brandId;
                        bValue = b.brandId;
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt);
                        bValue = new Date(b.createdAt);
                        break;
                    case 'updatedAt':
                        aValue = new Date(a.updatedAt || a.createdAt);
                        bValue = new Date(b.updatedAt || b.createdAt);
                        break;
                    case 'creator':
                        aValue = BRAND_HELPERS.getUsername(a.createdBy).toLowerCase();
                        bValue = BRAND_HELPERS.getUsername(b.createdBy).toLowerCase();
                        break;
                    default:
                        aValue = a[sortConfig.key];
                        bValue = b[sortConfig.key];
                }

                if (sortConfig.direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        } else {
            // THÊM: Mặc định sort theo ngày tạo mới nhất nếu không có sort config
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredBrands(result);
        setCurrentPage(1);
    }, [brands, searchTerm, filters, sortConfig]);

    // Clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            status: '',
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSortConfig({ key: 'createdAt', direction: 'desc' });
    };

    // Handle date preset changes
    const handleDatePresetChange = (preset) => {
        const now = new Date();
        let startDate = '';
        let endDate = '';

        switch (preset) {
            case 'today':
                startDate = now.toISOString().split('T')[0];
                endDate = startDate;
                break;
            case 'yesterday':
                { const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                startDate = yesterday.toISOString().split('T')[0];
                endDate = startDate;
                break; }
            case 'last7days':
                { const last7Days = new Date(now);
                last7Days.setDate(last7Days.getDate() - 7);
                startDate = last7Days.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break; }
            case 'last30days':
                { const last30Days = new Date(now);
                last30Days.setDate(last30Days.getDate() - 30);
                startDate = last30Days.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break; }
            case 'last3months':
                { const last3Months = new Date(now);
                last3Months.setMonth(last3Months.getMonth() - 3);
                startDate = last3Months.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break; }
            default:
                startDate = '';
                endDate = '';
        }

        setFilters(prev => ({
            ...prev,
            startDate,
            endDate,
            datePreset: preset
        }));
    };

    // Get statistics
    const getStatistics = () => {
        const totalBrands = brands.length;
        const activeBrands = brands.filter(brand => brand.isActive).length;
        const inactiveBrands = brands.filter(brand => !brand.isActive).length;
        const filteredCount = filteredBrands.length;

        return {
            totalBrands,
            activeBrands,
            inactiveBrands,
            filteredCount
        };
    };

    // Get unique creators for filter options
    const getUniqueCreators = () => {
        const creators = brands.map(brand => BRAND_HELPERS.getUsername(brand.createdBy));
        return [...new Set(creators)].filter(creator => creator !== 'Unknown');
    };

    // Load data on mount
    useEffect(() => {
        fetchBrands();
    }, []);

    return {
        // Data
        brands,
        filteredBrands,
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
        fetchBrands,
        createBrand: createBrandHandler,
        updateBrand: updateBrandHandler,
        deleteBrand: deleteBrandHandler,

        // Utilities
        clearFilters,
        handleDatePresetChange,
        getStatistics,
        getUniqueCreators
    };
};
