import { useState, useEffect, useCallback } from 'react';
import { CategoryManagementAPI } from '../utils/api/CategoryManagementAPI';

export const useCategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [parentCategories, setParentCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Transform API data to match component format
    const transformCategoryData = (apiCategory) => {
        return {
            id: apiCategory.categoryId.toString(),
            name: apiCategory.categoryName,
            parentCategoryId: apiCategory.parentCategory?.categoryId?.toString() || null,
            parentCategoryName: apiCategory.parentCategory?.categoryName || '',
            status: apiCategory.isActive ? 'Đang bán' : 'Ngừng bán',
            createdBy: apiCategory.createdBy?.username || '',
            createdDate: apiCategory.createdAt ? new Date(apiCategory.createdAt).toISOString().split('T')[0] : '',
            image: apiCategory.images?.[0]?.imageUrl || 'https://via.placeholder.com/150x150/6B7280/FFFFFF?text=No+Image',
            updatedBy: apiCategory.updatedBy ? [{
                user: apiCategory.updatedBy.username,
                date: apiCategory.updatedAt,
                action: 'Cập nhật danh mục'
            }] : []
        };
    };

    // Handle API errors, especially token expiry
    const handleApiError = (error) => {
        if (error.message.includes('401') || error.message.includes('403')) {
            // Token expired or unauthorized
            localStorage.removeItem('adminAuthToken');
            sessionStorage.removeItem('adminAuthToken');
            localStorage.removeItem('adminUserInfo');
            sessionStorage.removeItem('adminUserInfo');
            window.location.href = '/admin/login';
            return;
        }
        throw error;
    };

    // Load all categories
    const loadCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const apiCategories = await CategoryManagementAPI.getAllCategories();

            // Transform data
            const transformedCategories = apiCategories.map(transformCategoryData);

            // Separate parent categories (categories without parentCategory)
            const parents = transformedCategories.filter(cat => !cat.parentCategoryId);
            const parentCategoriesFormatted = parents.map(cat => ({
                id: cat.id,
                name: cat.name,
                status: cat.status
            }));

            setCategories(transformedCategories);
            setParentCategories(parentCategoriesFormatted);
        } catch (err) {
            handleApiError(err);
            setError(err.message);
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new category
    const createCategory = async (categoryData, imageFile) => {
        setLoading(true);
        setError(null);
        try {
            // Đảm bảo dữ liệu đúng format cho API
            const apiCategoryData = {
                categoryName: categoryData.categoryName, // Sử dụng categoryName thay vì name
                parentCategoryId: categoryData.parentCategoryId
            };

            const newCategory = await CategoryManagementAPI.createCategory(apiCategoryData, imageFile);

            // Reload categories to get updated data
            await loadCategories();
            return newCategory;
        } catch (err) {
            handleApiError(err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update category
    const updateCategory = async (categoryId, categoryData, imageFile) => {
        setLoading(true);
        setError(null);
        try {
            // Đảm bảo dữ liệu đúng format cho API
            const apiCategoryData = {
                categoryName: categoryData.categoryName, // Sử dụng categoryName thay vì name
                parentCategoryId: categoryData.parentCategoryId
            };

            const updatedCategory = await CategoryManagementAPI.updateCategory(categoryId, apiCategoryData, imageFile);

            // Reload categories to get updated data
            await loadCategories();
            return updatedCategory;
        } catch (err) {
            handleApiError(err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete category (soft delete)
    const deleteCategory = async (categoryId) => {
        setLoading(true);
        setError(null);
        try {
            const deletedCategory = await CategoryManagementAPI.deleteCategory(categoryId);

            // Reload categories to get updated data
            await loadCategories();
            return deletedCategory;
        } catch (err) {
            handleApiError(err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Toggle category status
    const toggleCategoryStatus = async (categoryId) => {
        setLoading(true);
        setError(null);
        try {
            const category = categories.find(cat => cat.id === categoryId);
            if (category?.status === 'Đang bán') {
                // Deactivate
                await CategoryManagementAPI.deleteCategory(categoryId);
            } else {
                // Reactivate
                await CategoryManagementAPI.reactivateCategory(categoryId);
            }

            // Reload categories to get updated data
            await loadCategories();
        } catch (err) {
            handleApiError(err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    return {
        categories,
        parentCategories,
        loading,
        error,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus
    };
};
