// src/hooks/useCategoryManagement.js
import { useState, useEffect } from 'react';
// SỬA: Import từng function riêng lẻ để tránh lỗi export
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../utils/api/Admin/CategoryManagementAPI.js';
import { CATEGORY_HELPERS } from '../utils/constants/CategoryConstants';

export const useCategoryManagement = () => {
    // Data state - ĐỒNG NHẤT với Brand
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [parentCategories, setParentCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state - ĐỒNG NHẤT với Brand
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, Filter, Sort state - ĐỒNG NHẤT với Brand
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        parentCategory: '',
        startDate: '',
        endDate: '',
        datePreset: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Fetch categories from API - SỬA: Gọi trực tiếp function
    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching categories...'); // Debug log
            const result = await getAllCategories(); // SỬA: Bỏ CategoryManagementAPI.

            if (result.success) {
                console.log('Categories fetched successfully:', result.data); // Debug log
                setCategories(result.data);

                // Extract parent categories (categories without parentCategory)
                const parentCats = result.data.filter(cat => !cat.parentCategory);
                setParentCategories(parentCats);

                console.log('Parent categories:', parentCats); // Debug log
            } else {
                console.error('Failed to fetch categories:', result.error);
                setError(result.error || 'Có lỗi xảy ra khi tải dữ liệu');
            }
        } catch (err) {
            console.error('Error in fetchCategories:', err);
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Create category - SỬA: Gọi trực tiếp function
    const createCategoryHandler = async (categoryData, categoryImage) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Creating category:', categoryData, categoryImage?.name || 'No image'); // Debug log
            const result = await createCategory(categoryData, categoryImage); // SỬA: Bỏ CategoryManagementAPI.

            if (result.success) {
                console.log('Category created successfully:', result.data);
                await fetchCategories(); // Refresh the list
                return { success: true, data: result.data };
            } else {
                console.error('Failed to create category:', result.error);
                return { success: false, error: result.error || 'Có lỗi xảy ra khi tạo danh mục' };
            }
        } catch (err) {
            console.error('Error in createCategory:', err);
            return { success: false, error: 'Có lỗi xảy ra khi tạo danh mục' };
        } finally {
            setLoading(false);
        }
    };

    // Update category - SỬA: Gọi trực tiếp function
    const updateCategoryHandler = async (categoryId, categoryData, categoryImage) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Updating category:', categoryId, categoryData, categoryImage); // Debug log
            const result = await updateCategory(categoryId, categoryData, categoryImage); // SỬA: Bỏ CategoryManagementAPI.

            if (result.success) {
                console.log('Category updated successfully:', result.data);
                await fetchCategories(); // Refresh the list
                return { success: true, data: result.data };
            } else {
                console.error('Failed to update category:', result.error);
                return { success: false, error: result.error || 'Có lỗi xảy ra khi cập nhật danh mục' };
            }
        } catch (err) {
            console.error('Error in updateCategory:', err);
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật danh mục' };
        } finally {
            setLoading(false);
        }
    };

    // Delete category - SỬA: Gọi trực tiếp function
    const deleteCategoryHandler = async (categoryId) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Changing category status:', categoryId); // Debug log
            const result = await deleteCategory(categoryId); // SỬA: Bỏ CategoryManagementAPI.

            if (result.success) {
                console.log('Category status changed successfully:', result.data);
                await fetchCategories(); // Refresh the list
                return { success: true, data: result.data };
            } else {
                console.error('Failed to change category status:', result.error);
                return { success: false, error: result.error || 'Có lỗi xảy ra khi thay đổi trạng thái danh mục' };
            }
        } catch (err) {
            console.error('Error in deleteCategory:', err);
            return { success: false, error: 'Có lỗi xảy ra khi thay đổi trạng thái danh mục' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic - ĐỒNG NHẤT với Brand structure
    useEffect(() => {
        console.log('Applying filters and search...'); // Debug log
        let result = [...categories];

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(category => {
                const categoryName = category.categoryName?.toLowerCase() || '';
                const categoryId = category.categoryId?.toString() || '';
                const parentCategoryName = category.parentCategory?.categoryName?.toLowerCase() || '';
                const createdByUsername = CATEGORY_HELPERS.getUsername(category.createdBy).toLowerCase();
                const createdByEmail = CATEGORY_HELPERS.getUserEmail(category.createdBy).toLowerCase();

                return (
                    categoryName.includes(searchLower) ||
                    categoryId.includes(searchLower) ||
                    parentCategoryName.includes(searchLower) ||
                    createdByUsername.includes(searchLower) ||
                    createdByEmail.includes(searchLower)
                );
            });
        }

        // Apply status filter
        if (filters.status !== '') {
            const isActive = filters.status === 'true';
            result = result.filter(category => category.isActive === isActive);
        }

        // Apply parent category filter
        if (filters.parentCategory) {
            const parentCategoryId = parseInt(filters.parentCategory);
            result = result.filter(category =>
                category.parentCategory && category.parentCategory.categoryId === parentCategoryId
            );
        }

        // Apply date range filter
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999); // Include the entire end date

            result = result.filter(category => {
                const createdDate = new Date(category.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            });
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'categoryName':
                        aValue = (a.categoryName || '').toLowerCase();
                        bValue = (b.categoryName || '').toLowerCase();
                        break;
                    case 'categoryId':
                        aValue = a.categoryId || 0;
                        bValue = b.categoryId || 0;
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt || 0);
                        bValue = new Date(b.createdAt || 0);
                        break;
                    case 'updatedAt':
                        aValue = new Date(a.updatedAt || a.createdAt || 0);
                        bValue = new Date(b.updatedAt || b.createdAt || 0);
                        break;
                    case 'parentCategoryName':
                        aValue = (a.parentCategory?.categoryName || '').toLowerCase();
                        bValue = (b.parentCategory?.categoryName || '').toLowerCase();
                        break;
                    case 'creator':
                        aValue = CATEGORY_HELPERS.getUsername(a.createdBy).toLowerCase();
                        bValue = CATEGORY_HELPERS.getUsername(b.createdBy).toLowerCase();
                        break;
                    case 'status':
                        aValue = a.isActive ? 1 : 0;
                        bValue = b.isActive ? 1 : 0;
                        break;
                    default:
                        aValue = a[sortConfig.key] || '';
                        bValue = b[sortConfig.key] || '';
                }

                if (sortConfig.direction === 'asc') {
                    return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                } else {
                    return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                }
            });
        } else {
            // ĐỒNG NHẤT: Mặc định sort theo ngày tạo mới nhất nếu không có sort config
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        console.log('Filtered categories:', result.length); // Debug log
        setFilteredCategories(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [categories, searchTerm, filters, sortConfig]);

    // Clear all filters - ĐỒNG NHẤT với Brand
    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            status: '',
            parentCategory: '',
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSortConfig({ key: 'createdAt', direction: 'desc' });
        setCurrentPage(1);
    };

    // Handle date preset changes - ĐỒNG NHẤT với Brand
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
            {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                startDate = yesterday.toISOString().split('T')[0];
                endDate = startDate;
                break;
            }
            case 'last7days':
            {
                const last7Days = new Date(now);
                last7Days.setDate(last7Days.getDate() - 7);
                startDate = last7Days.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break;
            }
            case 'last30days':
            {
                const last30Days = new Date(now);
                last30Days.setDate(last30Days.getDate() - 30);
                startDate = last30Days.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break;
            }
            case 'last3months':
            {
                const last3Months = new Date(now);
                last3Months.setMonth(last3Months.getMonth() - 3);
                startDate = last3Months.toISOString().split('T')[0];
                endDate = now.toISOString().split('T')[0];
                break;
            }
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

    // Get statistics - ĐỒNG NHẤT với Brand
    const getStatistics = () => {
        const totalCategories = categories.length;
        const activeCategories = categories.filter(cat => cat.isActive).length;
        const inactiveCategories = categories.filter(cat => !cat.isActive).length;
        const filteredCount = filteredCategories.length;

        return {
            totalCategories,
            activeCategories,
            inactiveCategories,
            filteredCount
        };
    };

    // Get unique creators for filter options - THÊM giống Brand
    const getUniqueCreators = () => {
        const creators = categories.map(category => CATEGORY_HELPERS.getUsername(category.createdBy));
        return [...new Set(creators)].filter(creator => creator !== 'Unknown');
    };

    // Initialize data on mount - ĐỒNG NHẤT với Brand
    useEffect(() => {
        console.log('useCategoryManagement hook initialized'); // Debug log
        fetchCategories();
    }, []);

    // Return all the state and functions
    return {
        // Data
        categories,
        filteredCategories,
        parentCategories,
        loading,
        error,

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,

        // Search and filters
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,

        // CRUD operations
        fetchCategories,
        createCategory: createCategoryHandler,
        updateCategory: updateCategoryHandler,
        deleteCategory: deleteCategoryHandler,

        // Utility functions
        clearFilters,
        handleDatePresetChange,
        getStatistics,
        getUniqueCreators
    };
};

