import { useState, useEffect, useCallback } from 'react';

import {
    getAllProducts,
    getAllColors,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
} from '../utils/api/Admin/ProductManagementAPI';
import { getAllBrands } from '../utils/api/Admin/BrandManagementAPI';
import { getAllCategories } from '../utils/api/Admin/CategoryManagementAPI';
import { PRODUCT_HELPERS } from '../utils/constants/ProductConstants';

export const useProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
            if (productsResult.success) setProducts(productsResult.data);
            else setError(productsResult.error);
            if (colorsResult.success) setColors(colorsResult.data);
            if (brandsResult.success) setBrands(brandsResult.data);
            if (categoriesResult.success) setCategories(categoriesResult.data);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProductHandler = async (productData, productImages) => {
        setLoading(true);
        try {
            const result = await createProduct(productData, productImages);
            if (result.success) {
                await fetchAllData();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch {
            return { success: false, error: 'Có lỗi xảy ra khi tạo sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    const updateProductHandler = async (productId, productData, productImages, existingImages = []) => {
        setLoading(true);
        try {
            const result = await updateProduct(productId, productData, productImages, existingImages);
            if (result.success) {
                await fetchAllData();
                return { success: true };
            }
            return { success: false, error: result.error };
        } catch {
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
            }
            return { success: false, error: result.error };
        } catch {
            return { success: false, error: 'Có lỗi xảy ra khi xóa sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    // Đúng chuẩn: Lấy chi tiết sản phẩm qua id
    const viewProductHandler = async (productId) => {
        try {
            const result = await getProductById(productId);
            if (result.success) return { success: true, data: result.data };
            return { success: false, error: result.error };
        } catch {
            return { success: false, error: 'Có lỗi xảy ra khi lấy thông tin sản phẩm' };
        }
    };

    useEffect(() => { fetchAllData(); }, [fetchAllData]);

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
            result = result.filter(product =>
                (product.brandId && parseInt(product.brandId) === filterBrandId) ||
                (product.brand && product.brand.brandId && parseInt(product.brand.brandId) === filterBrandId)
            );
        }
        if (filters.category) {
            const filterCategoryId = parseInt(filters.category);
            result = result.filter(product =>
                (product.categoryId && parseInt(product.categoryId) === filterCategoryId) ||
                (product.category && product.category.categoryId && parseInt(product.category.categoryId) === filterCategoryId)
            );
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

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);

    return {
        products: filteredProducts.slice(startIndex, endIndex),
        allProducts: products,
        filteredProducts,
        colors,
        brands,
        categories,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,
        clearFilters: () => {
            setFilters({
                brand: '',
                category: '',
                status: '',
                startDate: '',
                endDate: '',
                datePreset: ''
            });
            setSearchTerm('');
        },
        currentPage,
        totalPages,
        itemsPerPage,
        setCurrentPage,
        totalItems: filteredProducts.length,
        startIndex: startIndex + 1,
        endIndex,
        createProduct: createProductHandler,
        updateProduct: updateProductHandler,
        deleteProduct: deleteProductHandler,
        viewProduct: viewProductHandler,
        refreshData: fetchAllData,
        getStatistics: useCallback(() => ({
            totalProducts: products.length,
            activeProducts: products.filter(p => p.isActive).length,
            inactiveProducts: products.filter(p => !p.isActive).length,
            totalBrands: brands.length,
            totalCategories: categories.length,
            averagePrice: products.length > 0
                ? products.reduce((sum, p) => sum + (p.unitPrice || 0), 0) / products.length
                : 0
        }), [products, brands, categories])
    };
};

export default useProductManagement;
