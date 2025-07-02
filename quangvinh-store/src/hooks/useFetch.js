// // src/hooks/useFetch.js



// import { useState, useEffect, useCallback } from "react";
// import {
//     fetchStaffProducts,
//     fetchStaffCategories,
//     fetchStaffProductTypes,
//     fetchBrands
// } from "../utils/api";
//
// // PRODUCTS
// export const useFetchStaffProducts = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const fetchProducts = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await fetchStaffProducts();
//             if (!data) {
//                 setProducts([]);
//                 return [];
//             }
//             // Nếu API trả về { products: [...] }
//             const productList = Array.isArray(data) ? data : (data.products ? data.products : []);
//             setProducts(productList || []);
//             return data;
//         } catch (err) {
//             console.error('Error fetching products:', err);
//             setError(err.message || 'Không thể tải sản phẩm. Vui lòng thử lại sau.');
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     useEffect(() => {
//         let isMounted = true;
//         const loadData = async () => {
//             try {
//                 const result = await fetchProducts();
//                 // Chỉ cập nhật state nếu component vẫn mounted
//                 if (isMounted) {
//                     if (result) {
//                         const productList = Array.isArray(result) ? result : (result.products ? result.products : []);
//                         setProducts(productList || []);
//                     } else {
//                         setProducts([]);
//                     }
//                 }
//             } catch (error) {
//                 if (isMounted) {
//                     console.error('Error in useEffect:', error);
//                     setError(error.message || 'Lỗi khi tải dữ liệu sản phẩm');
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };
//
//         loadData();
//
//         // Cleanup function
//         return () => {
//             isMounted = false;
//         };
//     }, [fetchProducts]);
//
//     return { products, setProducts, loading, error, refetch: fetchProducts };
// };
//
// // CATEGORIES
// export const useFetchStaffCategories = () => {
//     const [categories, setCategories] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const fetchCategories = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await fetchStaffCategories();
//             if (!data) {
//                 setCategories([]);
//                 return [];
//             }
//             const categoryList = Array.isArray(data) ? data : (data.categories ? data.categories : []);
//             setCategories(categoryList || []);
//             return data;
//         } catch (err) {
//             console.error('Error fetching categories:', err);
//             setError(err.message || 'Không thể tải danh mục. Vui lòng thử lại sau.');
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     useEffect(() => {
//         let isMounted = true;
//         const loadData = async () => {
//             try {
//                 const result = await fetchCategories();
//                 // Chỉ cập nhật state nếu component vẫn mounted
//                 if (isMounted) {
//                     if (result) {
//                         const categoryList = Array.isArray(result) ? result : (result.categories ? result.categories : []);
//                         setCategories(categoryList || []);
//                     } else {
//                         setCategories([]);
//                     }
//                 }
//             } catch (error) {
//                 if (isMounted) {
//                     setError(error.message || 'Lỗi khi tải danh mục');
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };
//
//         loadData();
//
//         // Cleanup function
//         return () => {
//             isMounted = false;
//         };
//     }, [fetchCategories]);
//
//     return { categories, setCategories, loading, error, refetch: fetchCategories };
// };
//
// // PRODUCT TYPES
// export const useFetchStaffProductTypes = () => {
//     const [productTypes, setProductTypes] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const fetchProductTypes = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await fetchStaffProductTypes();
//             if (!data) {
//                 setProductTypes([]);
//                 return [];
//             }
//             const typesList = Array.isArray(data) ? data : (data.productTypes ? data.productTypes : []);
//             setProductTypes(typesList || []);
//             return data;
//         } catch (err) {
//             console.error('Error fetching product types:', err);
//             setError(err.message || 'Không thể tải loại sản phẩm. Vui lòng thử lại sau.');
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     useEffect(() => {
//         let isMounted = true;
//         const loadData = async () => {
//             try {
//                 const result = await fetchProductTypes();
//                 // Chỉ cập nhật state nếu component vẫn mounted
//                 if (isMounted) {
//                     if (result) {
//                         const typesList = Array.isArray(result) ? result : (result.productTypes ? result.productTypes : []);
//                         setProductTypes(typesList || []);
//                     } else {
//                         setProductTypes([]);
//                     }
//                 }
//             } catch (error) {
//                 if (isMounted) {
//                     setError(error.message || 'Lỗi khi tải loại sản phẩm');
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };
//
//         loadData();
//
//         // Cleanup function
//         return () => {
//             isMounted = false;
//         };
//     }, [fetchProductTypes]);
//
//     return { productTypes, setProductTypes, loading, error, refetch: fetchProductTypes };
// };
//
// // BRANDS
// export const useFetchBrands = () => {
//     const [brands, setBrands] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const fetchBrandsData = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const data = await fetchBrands();
//             if (!data) {
//                 setBrands([]);
//                 return [];
//             }
//             const brandList = Array.isArray(data) ? data : (data.brands ? data.brands : []);
//             setBrands(brandList || []);
//             return data;
//         } catch (err) {
//             console.error('Error fetching brands:', err);
//             setError(err.message || 'Không thể tải thương hiệu. Vui lòng thử lại sau.');
//             return null;
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     useEffect(() => {
//         let isMounted = true;
//         const loadData = async () => {
//             try {
//                 const result = await fetchBrandsData();
//                 // Chỉ cập nhật state nếu component vẫn mounted
//                 if (isMounted) {
//                     if (result) {
//                         const brandList = Array.isArray(result) ? result : (result.brands ? result.brands : []);
//                         setBrands(brandList || []);
//                     } else {
//                         setBrands([]);
//                     }
//                 }
//             } catch (error) {
//                 if (isMounted) {
//                     setError(error.message || 'Lỗi khi tải thương hiệu');
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };
//
//         loadData();
//
//         // Cleanup function
//         return () => {
//             isMounted = false;
//         };
//     }, [fetchBrandsData]);
//
//     return { brands, setBrands, loading, error, refetch: fetchBrandsData };
// };
