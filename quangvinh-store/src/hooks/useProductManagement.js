// src/hooks/useProductManagement.js
import { useState, useEffect, useCallback } from 'react';
import {
    getAllProducts,
    getAllColors,
    createProduct,
    updateProduct,
    deleteProduct
} from '../utils/api/Admin/ProductManagementAPI';
import { getAllBrands } from '../utils/api/Admin/BrandManagementAPI';
import { getAllCategories } from '../utils/api/Admin/CategoryManagementAPI';
import { PRODUCT_HELPERS } from '../utils/constants/ProductConstants';

export const useProductManagement = () => {
    // Data state
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Search, Filter, Sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        brand: '',
        category: '',
        status: '',
        startDate: '',
        endDate: '',
        datePreset: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    // Fetch all data
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productsResult, colorsResult, brandsResult, categoriesResult] = await Promise.all([
                getAllProducts(),
                getAllColors(),
                getAllBrands(),
                getAllCategories()
            ]);

            if (productsResult.success) {
                setProducts(productsResult.data);
            } else {
                setError(productsResult.error);
            }
            if (colorsResult.success) setColors(colorsResult.data);
            if (brandsResult.success) setBrands(brandsResult.data);
            if (categoriesResult.success) setCategories(categoriesResult.data);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, []);

    const getStatistics = useCallback(() => {
        return {
            totalProducts: products.length,
            activeProducts: products.filter(p => p.isActive).length,
            inactiveProducts: products.filter(p => !p.isActive).length,
            totalBrands: brands.length,
            totalCategories: categories.length,
            averagePrice: products.length > 0
                ? products.reduce((sum, p) => sum + (p.unitPrice || 0), 0) / products.length
                : 0
        };
    }, [products, brands, categories]);

    const createProductHandler = async (productData, productImages) => {
        setLoading(true);
        try {
            if (!productData.brandId || !productData.categoryId) {
                return {
                    success: false,
                    error: 'Thiếu thông tin thương hiệu hoặc danh mục'
                };
            }
            if (!productData.productVariants || productData.productVariants.length === 0) {
                return {
                    success: false,
                    error: 'Sản phẩm phải có ít nhất một biến thể'
                };
            }
            const result = await createProduct(productData, productImages);
            if (result.success) {
                await fetchAllData();
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi tạo sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    // SỬA ĐÚNG: nhận existingImages từ component gọi vào
    const updateProductHandler = async (productId, productData, productImages, existingImages = []) => {
        setLoading(true);
        try {
            if (!productData.brandId || !productData.categoryId) {
                return {
                    success: false,
                    error: 'Thiếu thông tin thương hiệu hoặc danh mục'
                };
            }
            if (!productData.productVariants || productData.productVariants.length === 0) {
                return {
                    success: false,
                    error: 'Sản phẩm phải có ít nhất một biến thể'
                };
            }
            // Truyền existingImages vào updateProduct
            const result = await updateProduct(productId, productData, productImages, existingImages);
            if (result.success) {
                await fetchAllData();
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    const deleteProductHandler = async (productId) => {
        setLoading(true);
        try {
            const result = await deleteProduct(productId);
            if (result.success) {
                await fetchAllData();
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'Có lỗi xảy ra khi xóa sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = [...products];
        if (searchTerm) {
            result = result.filter(product => {
                const productName = (product.productName || '').toLowerCase();
                const productId = (product.productId || '').toString();
                const searchLower = searchTerm.toLowerCase();
                return productName.includes(searchLower) || productId.includes(searchLower);
            });
        }
        if (filters.brand) {
            const filterBrandId = parseInt(filters.brand);
            result = result.filter(product => {
                if (product.brandId) {
                    return parseInt(product.brandId) === filterBrandId;
                }
                if (product.brand && product.brand.brandId) {
                    return parseInt(product.brand.brandId) === filterBrandId;
                }
                return false;
            });
        }
        if (filters.category) {
            const filterCategoryId = parseInt(filters.category);
            result = result.filter(product => {
                if (product.categoryId) {
                    return parseInt(product.categoryId) === filterCategoryId;
                }
                if (product.category && product.category.categoryId) {
                    return parseInt(product.category.categoryId) === filterCategoryId;
                }
                return false;
            });
        }
        if (filters.status !== '') {
            const isActive = filters.status === 'true';
            result = result.filter(product => product.isActive === isActive);
        }
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            result = result.filter(product => {
                const createdDate = new Date(product.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            });
        }
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;
                switch (sortConfig.key) {
                    case 'productName':
                        aValue = (a.productName || '').toLowerCase();
                        bValue = (b.productName || '').toLowerCase();
                        break;
                    case 'productId':
                        aValue = a.productId || 0;
                        bValue = b.productId || 0;
                        break;
                    case 'unitPrice':
                        aValue = a.unitPrice || 0;
                        bValue = b.unitPrice || 0;
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt || 0);
                        bValue = new Date(b.createdAt || 0);
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
            result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }
        setFilteredProducts(result);
        setCurrentPage(1);
    }, [products, searchTerm, filters, sortConfig]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    const handleFilterChange = useCallback((filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            brand: '',
            category: '',
            status: '',
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSearchTerm('');
    }, []);

    const handleSort = useCallback((key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const handleDatePreset = useCallback((preset) => {
        const today = new Date();
        let startDate = '';
        let endDate = '';

        switch (preset) {
            case 'today':
                startDate = today.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
                break;
            case 'yesterday':
            { const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                startDate = yesterday.toISOString().split('T')[0];
                endDate = yesterday.toISOString().split('T')[0];
                break; }
            case 'thisWeek':
            { const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                startDate = weekStart.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
                break; }
            case 'thisMonth':
            { const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                startDate = monthStart.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
                break; }
            case 'lastMonth':
            { const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                startDate = lastMonthStart.toISOString().split('T')[0];
                endDate = lastMonthEnd.toISOString().split('T')[0];
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
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    return {
        products: currentProducts,
        allProducts: products,
        filteredProducts,
        colors,
        brands,
        categories,
        loading,
        error,
        searchTerm,
        filters,
        sortConfig,
        handleSearch,
        handleFilterChange,
        clearFilters,
        handleSort,
        handleDatePreset,
        currentPage,
        totalPages,
        itemsPerPage,
        setCurrentPage,
        totalItems: filteredProducts.length,
        startIndex: startIndex + 1,
        endIndex,
        createProduct: createProductHandler,
        updateProduct: updateProductHandler, // <-- truyền đúng handler
        deleteProduct: deleteProductHandler,
        refreshData: fetchAllData,
        getStatistics
    };
};

export default useProductManagement;
