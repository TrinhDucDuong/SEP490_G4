// src/hooks/useProductManagement.js

import { useState, useEffect } from 'react';
import {getAllColors, getAllProducts} from "../utils/api/Admin/ProductManagementAPI.js";
import {getAllBrands} from "../utils/api/Admin/BrandManagementAPI.js";
import {getAllCategories} from "../utils/api/Admin/CategoryManagementAPI.js";


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

    // Fetch all data với extensive debugging
    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('=== 🚀 FETCHING ALL DATA ===');

            const [productsResult, colorsResult, brandsResult, categoriesResult] = await Promise.all([
                getAllProducts(),
                getAllColors(),
                getAllBrands(),
                getAllCategories()
            ]);


            // Handle products
            if (productsResult.success) {
                console.log('✅ Products fetched successfully:', productsResult.data.length, 'items');
                console.log('📦 Sample product:', productsResult.data[0]);
                setProducts(productsResult.data);
            } else {
                console.error('❌ Failed to fetch products:', productsResult.error);
                setError(productsResult.error);
            }

            // Handle colors
            if (colorsResult.success) {
                console.log('🎨 Colors fetched successfully:', colorsResult.data.length, 'items');
                console.log('🎨 Sample color:', colorsResult.data[0]);
                setColors(colorsResult.data);
            } else {
                console.error('❌ Failed to fetch colors:', colorsResult.error);
            }

            // Handle brands với debug chi tiết
            if (brandsResult.success) {
                console.log('🏷️ Brands fetched successfully:', brandsResult.data.length, 'items');
                console.log('🏷️ Sample brand:', brandsResult.data[0]);
                console.log('🏷️ All brands:', brandsResult.data);
                setBrands(brandsResult.data);
            } else {
                console.error('❌ Failed to fetch brands:', brandsResult.error);
            }

            // Handle categories với debug chi tiết
            if (categoriesResult.success) {
                console.log('📂 Categories fetched successfully:', categoriesResult.data.length, 'items');
                console.log('📂 Sample category:', categoriesResult.data[0]);
                console.log('📂 All categories:', categoriesResult.data);
                setCategories(categoriesResult.data);
            } else {
                console.error('❌ Failed to fetch categories:', categoriesResult.error);
            }

            console.log('=== ✅ FETCH COMPLETED ===');

        } catch (err) {
            console.error('💥 Error in fetchAllData:', err);
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Create product
    const createProductHandler = async (productData, productImages) => {
        setLoading(true);
        try {
            console.log('📝 Creating product:', productData, productImages?.length || 0, 'images');

            // FIXED: Validation trước khi gửi
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
                console.log('✅ Product created successfully:', result.data);
                await fetchAllData(); // Refresh all data to get latest
                return { success: true };
            } else {
                console.error('❌ Failed to create product:', result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('💥 Error in createProduct:', err);
            return { success: false, error: 'Có lỗi xảy ra khi tạo sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

// FIXED: Update product với validation tốt hơn
    const updateProductHandler = async (productId, productData, productImages) => {
        setLoading(true);
        try {
            console.log('🔄 Updating product:', productId, productData, productImages?.length || 0, 'images');

            // FIXED: Validation trước khi gửi
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

            const result = await updateProduct(productId, productData, productImages);
            if (result.success) {
                console.log('✅ Product updated successfully:', result.data);
                await fetchAllData(); // Refresh all data to get latest
                return { success: true };
            } else {
                console.error('❌ Failed to update product:', result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('💥 Error in updateProduct:', err);
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    // Delete product
    const deleteProductHandler = async (productId) => {
        setLoading(true);
        try {
            console.log('🗑️ Deleting product:', productId);
            const result = await deleteProduct(productId);
            if (result.success) {
                console.log('✅ Product deleted successfully:', result.data);
                await fetchAllData(); // Refresh all data to get latest
                return { success: true };
            } else {
                console.error('❌ Failed to delete product:', result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('💥 Error in deleteProduct:', err);
            return { success: false, error: 'Có lỗi xảy ra khi xóa sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic với debug chi tiết
    useEffect(() => {
        console.log('🔍 === APPLYING FILTERS AND SEARCH ===');
        console.log('📊 Current data state:', {
            products: products.length,
            brands: brands.length,
            categories: categories.length,
            searchTerm,
            filters
        });

        let result = [...products];

        // Search
        if (searchTerm) {
            console.log('🔍 Searching for:', searchTerm);
            result = result.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productId.toString().includes(searchTerm)
            );
            console.log('🔍 After search filter:', result.length);
        }

        // Filter by brand - THÊM DEBUG CHI TIẾT
        if (filters.brand) {
            console.log('🏷️ Filtering by brand ID:', filters.brand);
            console.log('🏷️ Products before brand filter:', result.map(p => ({
                id: p.productId,
                name: p.productName,
                brandId: p.brandId,
                brand: p.brand
            })));

            result = result.filter(product => {
                // Kiểm tra cả brandId trực tiếp và nested brand object
                const productBrandId = product.brandId || product.brand?.brandId;
                const filterBrandId = parseInt(filters.brand);
                const matches = productBrandId === filterBrandId;

                console.log(`🏷️ Product ${product.productId} (${product.productName}):`, {
                    productBrandId,
                    filterBrandId,
                    matches
                });

                return matches;
            });

            console.log('🏷️ After brand filter:', result.length);
        }

        // Filter by category - THÊM DEBUG CHI TIẾT
        if (filters.category) {
            console.log('📂 Filtering by category ID:', filters.category);
            console.log('📂 Products before category filter:', result.map(p => ({
                id: p.productId,
                name: p.productName,
                categoryId: p.categoryId,
                category: p.category
            })));

            result = result.filter(product => {
                // Kiểm tra cả categoryId trực tiếp và nested category object
                const productCategoryId = product.categoryId || product.category?.categoryId;
                const filterCategoryId = parseInt(filters.category);
                const matches = productCategoryId === filterCategoryId;

                console.log(`📂 Product ${product.productId} (${product.productName}):`, {
                    productCategoryId,
                    filterCategoryId,
                    matches
                });

                return matches;
            });

            console.log('📂 After category filter:', result.length);
        }

        // Filter by status
        if (filters.status !== '') {
            const isActive = filters.status === 'true';
            console.log('📊 Filtering by status:', isActive);
            result = result.filter(product => product.isActive === isActive);
            console.log('📊 After status filter:', result.length);
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            console.log('📅 Filtering by date range:', filters.startDate, 'to', filters.endDate);
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);

            result = result.filter(product => {
                const createdDate = new Date(product.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            });
            console.log('📅 After date filter:', result.length);
        }

        // Sort
        if (sortConfig.key) {
            console.log('📊 Sorting by:', sortConfig.key, sortConfig.direction);
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'productName':
                        aValue = a.productName.toLowerCase();
                        bValue = b.productName.toLowerCase();
                        break;
                    case 'productId':
                        aValue = a.productId;
                        bValue = b.productId;
                        break;
                    case 'unitPrice':
                        aValue = a.unitPrice;
                        bValue = b.unitPrice;
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt);
                        bValue = new Date(b.createdAt);
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
            // Default sort by creation date (newest first)
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        console.log('✅ Final filtered products:', result.length);
        console.log('🔍 === FILTER COMPLETED ===');

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [products, searchTerm, filters, sortConfig, brands, categories]);

    // Clear filters
    const clearFilters = () => {
        console.log('🧹 Clearing all filters');
        setSearchTerm('');
        setFilters({
            brand: '',
            category: '',
            status: '',
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSortConfig({ key: 'createdAt', direction: 'desc' });
    };

    // Get statistics
    const getStatistics = () => {
        const totalProducts = products.length;
        const activeProducts = products.filter(product => product.isActive).length;
        const inactiveProducts = products.filter(product => !product.isActive).length;
        const filteredCount = filteredProducts.length;

        const stats = {
            totalProducts,
            activeProducts,
            inactiveProducts,
            filteredCount
        };

        console.log('📈 Statistics:', stats);
        return stats;
    };

    // Debug function để kiểm tra dữ liệu
    const debugProductData = () => {
        console.log('🔧 === DEBUG PRODUCT DATA ===');
        console.log('📦 Products count:', products.length);
        console.log('🏷️ Brands count:', brands.length);
        console.log('📂 Categories count:', categories.length);

        if (products.length > 0) {
            const sampleProduct = products[0];
            console.log('📦 Sample product:', {
                productId: sampleProduct.productId,
                productName: sampleProduct.productName,
                brandId: sampleProduct.brandId,
                categoryId: sampleProduct.categoryId,
                brand: sampleProduct.brand,
                category: sampleProduct.category,
                allKeys: Object.keys(sampleProduct)
            });
        }

        if (brands.length > 0) {
            console.log('🏷️ Sample brand:', brands[0]);
        }

        if (categories.length > 0) {
            console.log('📂 Sample category:', categories[0]);
        }

        console.log('🔧 === END DEBUG ===');
    };

    // Load data on mount
    useEffect(() => {
        console.log('🚀 useProductManagement hook initialized');
        fetchAllData();
    }, []);

    // Debug effect để log khi data thay đổi
    useEffect(() => {
        if (products.length > 0 && brands.length > 0 && categories.length > 0) {
            debugProductData();
        }
    }, [products, brands, categories]);

    return {
        // Data
        products,
        filteredProducts,
        colors,
        brands,
        categories,
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
        fetchProducts: fetchAllData,
        createProduct: createProductHandler,
        updateProduct: updateProductHandler,
        deleteProduct: deleteProductHandler,

        // Utilities
        clearFilters,
        getStatistics,
        debugProductData
    };
};
