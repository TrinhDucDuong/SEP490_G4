// src/hooks/useProductManagement.js

import { useState, useEffect } from 'react';
import { getAllProducts, getAllColors, createProduct, updateProduct, deleteProduct } from '../utils/api/ProductManagementAPI';
import { getAllBrands } from '../utils/api/BrandManagementAPI';
import { getAllCategories } from '../utils/api/CategoryManagementAPI';
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

    // Fetch all data - THÊM DEBUG LOGS
    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('=== FETCHING ALL DATA ===');

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

            // Handle brands - THÊM DEBUG CHI TIẾT
            if (brandsResult.success) {
                console.log('🏷️ Brands fetched successfully:', brandsResult.data.length, 'items');
                console.log('🏷️ Sample brand:', brandsResult.data[0]);
                console.log('🏷️ All brands:', brandsResult.data);
                setBrands(brandsResult.data);
            } else {
                console.error('❌ Failed to fetch brands:', brandsResult.error);
            }

            // Handle categories - THÊM DEBUG CHI TIẾT
            if (categoriesResult.success) {
                console.log('📂 Categories fetched successfully:', categoriesResult.data.length, 'items');
                console.log('📂 Sample category:', categoriesResult.data[0]);
                console.log('📂 All categories:', categoriesResult.data);
                setCategories(categoriesResult.data);
            } else {
                console.error('❌ Failed to fetch categories:', categoriesResult.error);
            }

            console.log('=== FETCH COMPLETED ===');

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
            console.log('Creating product:', productData, productImages?.length || 0, 'images');
            const result = await createProduct(productData, productImages);
            if (result.success) {
                console.log('Product created successfully:', result.data);
                await fetchAllData(); // Refresh all data to get latest
                return { success: true };
            } else {
                console.error('Failed to create product:', result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('Error in createProduct:', err);
            return { success: false, error: 'Có lỗi xảy ra khi tạo sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    // Update product
    const updateProductHandler = async (productId, productData, productImages) => {
        setLoading(true);
        try {
            console.log('Updating product:', productId, productData, productImages?.length || 0, 'images');
            const result = await updateProduct(productId, productData, productImages);
            if (result.success) {
                console.log('Product updated successfully:', result.data);
                await fetchAllData(); // Refresh all data to get latest
                return { success: true };
            } else {
                console.error('Failed to update product:', result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('Error in updateProduct:', err);
            return { success: false, error: 'Có lỗi xảy ra khi cập nhật sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    // Delete product
    const deleteProductHandler = async (productId) => {
        setLoading(true);
        try {
            console.log('Deleting product:', productId);
            const result = await deleteProduct(productId);
            if (result.success) {
                console.log('Product deleted successfully:', result.data);
                await fetchAllData(); // Refresh all data to get latest
                return { success: true };
            } else {
                console.error('Failed to delete product:', result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            console.error('Error in deleteProduct:', err);
            return { success: false, error: 'Có lỗi xảy ra khi xóa sản phẩm' };
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    useEffect(() => {
        console.log('🔍 Applying filters and search...');
        console.log('📊 Current data state:', {
            products: products.length,
            brands: brands.length,
            categories: categories.length
        });

        let result = [...products];

        // Search
        if (searchTerm) {
            result = result.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productId.toString().includes(searchTerm)
            );
        }

        // Filter by brand
        if (filters.brand) {
            console.log('🏷️ Filtering by brand:', filters.brand);
            result = result.filter(product =>
                product.brandId === parseInt(filters.brand)
            );
        }

        // Filter by category
        if (filters.category) {
            console.log('📂 Filtering by category:', filters.category);
            result = result.filter(product =>
                product.categoryId === parseInt(filters.category)
            );
        }

        // Filter by status
        if (filters.status !== '') {
            const isActive = filters.status === 'true';
            result = result.filter(product => product.isActive === isActive);
        }

        // Filter by date range
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);

            result = result.filter(product => {
                const createdDate = new Date(product.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            });
        }

        // Sort
        if (sortConfig.key) {
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
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        console.log('✅ Filtered products:', result.length);
        setFilteredProducts(result);
        setCurrentPage(1);
    }, [products, searchTerm, filters, sortConfig, brands, categories]);

    // Clear filters
    const clearFilters = () => {
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

        return {
            totalProducts,
            activeProducts,
            inactiveProducts,
            filteredCount
        };
    };

    // Load data on mount
    useEffect(() => {
        console.log('🚀 useProductManagement hook initialized');
        fetchAllData();
    }, []);

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
        getStatistics
    };
};
