import { useState, useEffect, useCallback } from 'react';
import { ProductManagementAPI } from '../utils/api/Admin/ProductManagementAPI.js';
import { useAuthForManager } from '../context/AuthContextForManager';

// Import constants và helpers
import { PRODUCT_BRAND_OPTIONS, PRODUCT_HELPERS } from '../utils/constants';

export const useProductManagement = () => {
    // Auth context để handle logout khi token hết hạn
    const authContext = useAuthForManager();
    const logout = authContext?.logout;

    // Core data states
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Search, filter, sort states
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        brand: '',
        color: '',
        size: '',
        status: '',
        startDate: '',
        endDate: '',
        datePreset: ''
    });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ✅ Helper function để check token
    const checkToken = () => {
        const token = localStorage.getItem('adminAuthToken') || sessionStorage.getItem('adminAuthToken');
        console.log('Current token:', token ? 'Token found' : 'No token');

        if (!token) {
            console.error('No token found in storage');
            return false;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            console.log('Token payload:', payload);
            console.log('Token expired:', isExpired);
            return !isExpired;
        } catch (error) {
            console.error('Invalid token format:', error);
            return false;
        }
    };

    // ✅ Helper function để map brand name sang brandId
    const getBrandIdFromName = useCallback((brandName) => {
        const brandMapping = {
            'Nike': 1,
            'Adidas': 2,
            'Puma': 3,
            'Gucci': 4,
            'Chanel': 5,
            'Dior': 6,
            'Prada': 7,
            'Supreme': 8,
            'Balenciaga': 9,
            'Louis Vuitton': 10,
            'Under Armour': 11,
            'North Face': 12,
            'Burberry': 13,
            'Moncler': 14,
            'Levi\'s': 15,
            'Zara': 16,
            'H&M': 17,
            'COS': 18,
            'Stussy': 19,
            'Patagonia': 20,
            'Forever 21': 21,
            'Other': 22
        };
        return brandMapping[brandName] || 1;
    }, []);

    const getCategoryIdFromName = useCallback((categoryName) => {
        const categoryMapping = {
            'Áo': 1,
            'Quần': 2,
            'Giày': 3,
            'Phụ kiện': 4,
            'Túi xách': 5
        };
        return categoryMapping[categoryName] || 1;
    }, []);

    // Sử dụng helper function từ constants
    const extractBrandFromName = useCallback((productName) => {
        if (!productName) return 'Other';

        const foundBrand = PRODUCT_BRAND_OPTIONS.find(brand => productName.includes(brand));
        return foundBrand || 'Other';
    }, []);

    // Transform API response to UI format với null safety
    const transformProductData = useCallback((apiProducts) => {
        if (!Array.isArray(apiProducts)) {
            console.warn('API products is not an array:', apiProducts);
            return [];
        }

        return apiProducts.map(product => ({
            id: product?.productId || 0,
            name: product?.productName || 'Unknown Product',
            code: `SP${String(product?.productId || 0).padStart(3, '0')}`,
            price: product?.unitPrice || 0,
            coverImage: product?.images?.[0]?.imageUrl || '',
            productImages: product?.images?.map(img => img?.imageUrl).filter(Boolean) || [],
            brand: extractBrandFromName(product?.productName),
            brandId: product?.brandId || null,
            categoryId: product?.categoryId || null,
            color: product?.productVariants?.[0]?.color?.colorHex || '#000000',
            size: product?.productVariants?.[0]?.productSize || '',
            quantity: product?.productVariants?.reduce((sum, variant) => sum + (variant?.quantity || 0), 0) || 0,
            description: product?.productDescription || '',
            variants: product?.productVariants?.map(variant => ({
                id: variant?.productVariantId || null,
                code: `BT${String(variant?.productVariantId || '').padStart(3, '0')}`,
                color: variant?.color?.colorHex || '#000000',
                size: variant?.productSize || '',
                quantity: variant?.quantity || 0
            })) || [],
            importedQuantity: product?.productVariants?.reduce((sum, variant) => sum + (variant?.quantity || 0), 0) || 0,
            soldQuantity: 0,
            createdDate: product?.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            createdBy: product?.createdBy?.username || 'Unknown',
            updatedBy: product?.updatedBy ? [{
                user: product.updatedBy.username,
                date: product.updatedAt
            }] : [],
            status: product?.isActive ? 'Đang bán' : 'Đã ngừng bán'
        }));
    }, [extractBrandFromName]);

    // Handle authentication errors với null safety
    const handleAuthError = useCallback((error) => {
        if (error?.message?.includes('Phiên đăng nhập đã hết hạn') ||
            error?.message?.includes('401') ||
            error?.response?.status === 401) {
            if (logout) {
                logout();
            }
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            return true;
        }
        return false;
    }, [logout]);

    // Fetch tất cả sản phẩm với better error handling
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await ProductManagementAPI.getAllProducts();

            // Kiểm tra response structure
            if (!response) {
                throw new Error('Không nhận được dữ liệu từ server');
            }

            // Xử lý cả trường hợp response.products và response trực tiếp là array
            let productsData = response.products || response;

            if (!Array.isArray(productsData)) {
                console.warn('Products data is not an array:', productsData);
                productsData = [];
            }

            const transformedProducts = transformProductData(productsData);
            setProducts(transformedProducts);
        } catch (err) {
            console.error('Fetch products error:', err);
            if (!handleAuthError(err)) {
                setError(err?.message || 'Không thể tải danh sách sản phẩm');
            }
        } finally {
            setLoading(false);
        }
    }, [transformProductData, handleAuthError]);

    // ✅ Tạo sản phẩm mới với brand và category đúng
    const createProduct = useCallback(async (productData, images) => {
        if (!productData) {
            return { success: false, error: 'Dữ liệu sản phẩm không hợp lệ' };
        }

        // ✅ Kiểm tra token trước khi gửi request
        if (!checkToken()) {
            return { success: false, error: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' };
        }

        // ✅ Validation với helper functions
        try {
            productData.variants?.forEach(variant => {
                if (!PRODUCT_HELPERS.isValidColor(variant.color)) {
                    throw new Error(`Màu sắc không hợp lệ: ${variant.color}`);
                }
                if (!PRODUCT_HELPERS.isValidSize(variant.size)) {
                    throw new Error(`Kích thước không hợp lệ: ${variant.size}`);
                }
            });
        } catch (validationError) {
            return { success: false, error: validationError.message };
        }

        setLoading(true);
        setError(null);
        try {
            // ✅ Lấy brandId và categoryId từ form data
            const brandId = productData.brand ? getBrandIdFromName(productData.brand) : (productData.brandId || 1);
            const categoryId = productData.category ? getCategoryIdFromName(productData.category) : (productData.categoryId || 1);

            const apiData = {
                productName: productData.name || '',
                productDescription: productData.description || '',
                unitPrice: (productData.price || 0).toString(),
                brandId: brandId,
                categoryId: categoryId,
                productVariants: (productData.variants || []).map(variant => ({
                    color: variant?.color || '#000000',
                    productSize: variant?.size || '',
                    quantity: variant?.quantity || 0
                }))
            };

            // ✅ Chỉ gửi File objects, không cần convert
            const imageFiles = (images || []).filter(img => img instanceof File);

            console.log('Create API Data:', apiData);
            console.log('Create Image Files:', imageFiles);

            await ProductManagementAPI.createProduct(apiData, imageFiles);
            await fetchProducts();
            return { success: true, message: 'Tạo sản phẩm thành công!' };
        } catch (err) {
            console.error('Create product error:', err);
            if (handleAuthError(err)) {
                return { success: false, error: 'Phiên đăng nhập đã hết hạn' };
            }
            const errorMessage = err?.message || 'Không thể tạo sản phẩm mới';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [fetchProducts, handleAuthError, getBrandIdFromName, getCategoryIdFromName]);

    // ✅ Cập nhật sản phẩm với brand và category đúng
    const updateProduct = useCallback(async (id, productData, images) => {
        if (!id || !productData) {
            return { success: false, error: 'Dữ liệu không hợp lệ' };
        }

        // ✅ Kiểm tra token trước khi gửi request
        if (!checkToken()) {
            return { success: false, error: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' };
        }

        // ✅ Validation với helper functions
        try {
            productData.variants?.forEach(variant => {
                if (!PRODUCT_HELPERS.isValidColor(variant.color)) {
                    throw new Error(`Màu sắc không hợp lệ: ${variant.color}`);
                }
                if (!PRODUCT_HELPERS.isValidSize(variant.size)) {
                    throw new Error(`Kích thước không hợp lệ: ${variant.size}`);
                }
            });
        } catch (validationError) {
            return { success: false, error: validationError.message };
        }

        setLoading(true);
        setError(null);
        try {
            // ✅ Lấy brandId và categoryId từ form data
            const brandId = productData.brand ? getBrandIdFromName(productData.brand) : (productData.brandId || 1);
            const categoryId = productData.category ? getCategoryIdFromName(productData.category) : (productData.categoryId || 1);

            const apiData = {
                productName: productData.name || '',
                productDescription: productData.description || '',
                unitPrice: (productData.price || 0).toString(),
                brandId: brandId,
                categoryId: categoryId,
                // ✅ Preserve existing variants with IDs
                productVariants: (productData.variants || []).map(variant => ({
                    productVariantId: variant?.id || null, // ✅ Quan trọng: giữ ID để update
                    color: variant?.color || '#000000',
                    productSize: variant?.size || '',
                    quantity: variant?.quantity || 0
                }))
            };

            // ✅ Chỉ gửi File objects, không cần convert
            const imageFiles = (images || []).filter(img => img instanceof File);

            console.log('Update API Data:', apiData);
            console.log('Update Image Files:', imageFiles);

            await ProductManagementAPI.updateProduct(id, apiData, imageFiles);
            await fetchProducts();
            return { success: true, message: 'Cập nhật sản phẩm thành công!' };
        } catch (err) {
            console.error('Update product error:', err);
            if (handleAuthError(err)) {
                return { success: false, error: 'Phiên đăng nhập đã hết hạn' };
            }
            const errorMessage = err?.message || `Không thể cập nhật sản phẩm với ID: ${id}`;
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [fetchProducts, handleAuthError, getBrandIdFromName, getCategoryIdFromName]);

    // Xóa sản phẩm với better error handling
    const deleteProduct = useCallback(async (id) => {
        if (!id) {
            return { success: false, error: 'ID sản phẩm không hợp lệ' };
        }

        // ✅ Kiểm tra token trước khi gửi request
        if (!checkToken()) {
            return { success: false, error: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.' };
        }

        setLoading(true);
        setError(null);
        try {
            await ProductManagementAPI.deleteProduct(id);
            await fetchProducts();
            return { success: true, message: 'Thay đổi trạng thái sản phẩm thành công!' };
        } catch (err) {
            console.error('Delete product error:', err);
            if (handleAuthError(err)) {
                return { success: false, error: 'Phiên đăng nhập đã hết hạn' };
            }
            const errorMessage = err?.message || `Không thể thay đổi trạng thái sản phẩm với ID: ${id}`;
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [fetchProducts, handleAuthError]);

    // Apply filters, search, and sort với null safety
    const applyFiltersAndSort = useCallback(() => {
        let result = [...(products || [])];

        // Search
        if (searchTerm) {
            result = result.filter(p =>
                (p?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p?.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p?.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by brand
        if (filters.brand) {
            result = result.filter(p => p?.brand === filters.brand);
        }

        // Filter by color
        if (filters.color) {
            result = result.filter(p =>
                (p?.variants || []).some(variant => variant?.color === filters.color)
            );
        }

        // Filter by size
        if (filters.size) {
            result = result.filter(p =>
                (p?.variants || []).some(variant => variant?.size === filters.size)
            );
        }

        // Filter by status
        if (filters.status) {
            result = result.filter(p => p?.status === filters.status);
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            result = result.filter(p => {
                if (!p?.createdDate) return false;
                const productDate = new Date(p.createdDate);
                const startDate = new Date(filters.startDate);
                const endDate = new Date(filters.endDate);
                return productDate >= startDate && productDate <= endDate;
            });
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a?.[sortConfig.key] || '';
                let bValue = b?.[sortConfig.key] || '';

                if (sortConfig.key === 'name' || sortConfig.key === 'code' || sortConfig.key === 'brand') {
                    aValue = aValue.toString().toLowerCase();
                    bValue = bValue.toString().toLowerCase();
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                } else if (sortConfig.key === 'quantity' || sortConfig.key === 'price') {
                    const aNum = Number(aValue) || 0;
                    const bNum = Number(bValue) || 0;
                    return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
                } else if (sortConfig.key === 'createdDate') {
                    const aDate = new Date(aValue);
                    const bDate = new Date(bValue);
                    return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
                }
                return 0;
            });
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [products, searchTerm, filters, sortConfig]);

    // Apply filters whenever dependencies change
    useEffect(() => {
        applyFiltersAndSort();
    }, [applyFiltersAndSort]);

    // Load products on mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Clear all filters and search
    const clearFilters = useCallback(() => {
        setFilters({
            brand: '',
            color: '',
            size: '',
            status: '',
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSearchTerm('');
        setSortConfig({ key: null, direction: 'asc' });
    }, []);

    // Get filter options
    const getFilterOptions = useCallback(() => {
        const safeProducts = products || [];
        const brands = [...new Set(safeProducts.map(p => p?.brand).filter(Boolean))].sort();
        const colors = [...new Set(safeProducts.flatMap(p => (p?.variants || []).map(v => v?.color)).filter(Boolean))];
        const sizes = [...new Set(safeProducts.flatMap(p => (p?.variants || []).map(v => v?.size)).filter(Boolean))].sort();
        const statuses = [...new Set(safeProducts.map(p => p?.status).filter(Boolean))];

        return { brands, colors, sizes, statuses };
    }, [products]);

    // Get statistics với null safety
    const getStatistics = useCallback(() => {
        const safeProducts = products || [];
        const totalProducts = safeProducts.length;
        const activeProducts = safeProducts.filter(p => p?.status === 'Đang bán').length;
        const inactiveProducts = safeProducts.filter(p => p?.status === 'Đã ngừng bán').length;
        const totalStock = safeProducts.reduce((sum, p) => sum + (p?.quantity || 0), 0);
        const lowStockProducts = safeProducts.filter(p => (p?.quantity || 0) < 10).length;

        return {
            totalProducts,
            activeProducts,
            inactiveProducts,
            totalStock,
            lowStockProducts
        };
    }, [products]);

    return {
        // Core data
        products: products || [],
        filteredProducts: filteredProducts || [],
        loading: loading || false,
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
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,

        // Utilities
        clearFilters,
        getFilterOptions,
        getStatistics,

        // Computed values
        totalPages: Math.ceil((filteredProducts || []).length / itemsPerPage),
        hasNextPage: currentPage < Math.ceil((filteredProducts || []).length / itemsPerPage),
        hasPrevPage: currentPage > 1,

        // Helper functions
        refreshData: fetchProducts,
        isLoading: loading,
        hasError: !!error,
        isEmpty: (filteredProducts || []).length === 0 && !loading && !error,

        // ✅ Debug helpers
        checkToken,
        getBrandIdFromName,
        getCategoryIdFromName
    };
};
