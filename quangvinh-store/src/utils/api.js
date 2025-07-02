// // src/utils/api.js




// const API_URL = "http://localhost:9999";
//
// // Helper function để lấy token từ localStorage
// const getAuthHeaders = () => {
//     const token = localStorage.getItem('token');
//     // Kiểm tra token có hợp lệ không (ít nhất phải là một chuỗi có độ dài hợp lý)
//     const isValidToken = token && typeof token === 'string' && token.length > 10;
//
//     if (isValidToken) {
//         return {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         };
//     } else {
//         // Nếu token không hợp lệ, xóa token để user đăng nhập lại
//         if (token) localStorage.removeItem('token');
//         return { 'Content-Type': 'application/json' };
//     }
// };
//
// // PRODUCT
// export const fetchStaffProducts = async () => {
//     try {
//         console.log('Fetching products from:', `${API_URL}/staff/product`);
//         const token = localStorage.getItem('token');
//         if (!token) {
//             console.error('No authentication token found');
//             throw new Error('Vui lòng đăng nhập để tiếp tục');
//         }
//
//         const response = await fetch(`${API_URL}/staff/product`, {
//             headers: getAuthHeaders(),
//             // Thêm timeout để tránh request treo quá lâu
//             signal: AbortSignal.timeout(15000) // 15 seconds timeout
//         });
//
//         if (!response.ok) {
//             let errorMessage = 'Không thể tải danh sách sản phẩm';
//             try {
//                 const errorData = await response.json();
//                 errorMessage = errorData.message || errorMessage;
//             } catch (e) {
//                 console.error('Error parsing error response:', e);
//             }
//
//             if (response.status === 401 || response.status === 403) {
//                 // Token hết hạn hoặc không có quyền
//                 localStorage.removeItem('token'); // Xóa token không hợp lệ
//                 errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
//             }
//
//             throw new Error(errorMessage);
//         }
//
//         const data = await response.json();
//         console.log('Products fetched successfully:', data);
//         return data;
//     } catch (error) {
//         console.error('API error when fetching products:', error);
//         if (error.name === 'AbortError') {
//             throw new Error('Kết nối đến máy chủ quá lâu, vui lòng thử lại');
//         }
//         throw error;
//     }
// };
//
// export const createStaffProduct = async (product) => {
//     try {
//         console.log('Creating product:', product);
//         const token = localStorage.getItem('token');
//         if (!token) {
//             console.error('No authentication token found');
//             throw new Error('Vui lòng đăng nhập để tiếp tục');
//         }
//
//         // Kiểm tra nếu có file hình ảnh thì sử dụng FormData
//         if (product.coverImage instanceof File ||
//             (product.productImages && product.productImages.some(img => img instanceof File))) {
//
//             const formData = new FormData();
//
//             // Thêm các trường dữ liệu cơ bản
//             Object.keys(product).forEach(key => {
//                 // Bỏ qua các trường file, sẽ xử lý riêng
//                 if (key !== 'coverImage' && key !== 'productImages') {
//                     // Kiểm tra giá trị null hoặc undefined
//                     if (product[key] !== null && product[key] !== undefined) {
//                         formData.append(key, typeof product[key] === 'object' ?
//                             JSON.stringify(product[key]) : product[key]);
//                     }
//                 }
//             });
//
//             // Thêm cover image nếu có
//             if (product.coverImage instanceof File) {
//                 formData.append('coverImage', product.coverImage);
//             }
//
//             // Thêm product images nếu có
//             if (product.productImages && Array.isArray(product.productImages)) {
//                 product.productImages.forEach((img, index) => {
//                     if (img instanceof File) {
//                         formData.append(`productImages[${index}]`, img);
//                     }
//                 });
//             }
//
//             // Gửi request với FormData và thêm timeout
//             const response = await fetch(`${API_URL}/staff/product`, {
//                 method: "POST",
//                 headers: {
//                     'Authorization': getAuthHeaders().Authorization
//                     // Không cần set Content-Type khi dùng FormData
//                 },
//                 body: formData,
//                 signal: AbortSignal.timeout(20000) // 20 seconds timeout cho upload ảnh
//             });
//
//             if (!response.ok) {
//                 let errorMessage = 'Không thể tạo sản phẩm';
//                 try {
//                     const errorData = await response.json();
//                     errorMessage = errorData.message || errorMessage;
//                     console.error('Server error response:', errorData);
//                 } catch (e) {
//                     console.error('Error parsing error response:', e);
//                 }
//
//                 if (response.status === 401 || response.status === 403) {
//                     // Token hết hạn hoặc không có quyền
//                     localStorage.removeItem('token');
//                     errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
//                 }
//
//                 throw new Error(errorMessage);
//             }
//
//             const data = await response.json();
//             console.log('Product created successfully:', data);
//             return data;
//         } else {
//             // Trường hợp không có file, sử dụng JSON như bình thường
//             const response = await fetch(`${API_URL}/staff/product`, {
//                 method: "POST",
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(product),
//             });
//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || 'Failed to create product');
//             }
//             return await response.json();
//         }
//     } catch (error) {
//         console.error('API error:', error);
//         throw error;
//     }
// };
//
// export const updateStaffProduct = async (id, product) => {
//     try {
//         console.log('Updating product with ID:', id, 'Data:', product);
//         if (!id) throw new Error('ID sản phẩm là bắt buộc');
//
//         const token = localStorage.getItem('token');
//         if (!token) {
//             throw new Error('Vui lòng đăng nhập để tiếp tục');
//         }
//
//         // Kiểm tra nếu có file hình ảnh thì sử dụng FormData
//         if (product.coverImage instanceof File ||
//             (product.productImages && product.productImages.some(img => img instanceof File))) {
//
//             const formData = new FormData();
//
//             // Thêm các trường dữ liệu cơ bản
//             Object.keys(product).forEach(key => {
//                 // Bỏ qua các trường file, sẽ xử lý riêng
//                 if (key !== 'coverImage' && key !== 'productImages') {
//                     // Kiểm tra giá trị null hoặc undefined
//                     if (product[key] !== null && product[key] !== undefined) {
//                         try {
//                             // Xử lý các đối tượng phức tạp
//                             if (typeof product[key] === 'object' && !(product[key] instanceof File)) {
//                                 formData.append(key, JSON.stringify(product[key]));
//                             } else {
//                                 formData.append(key, product[key]);
//                             }
//                         } catch (err) {
//                             console.error(`Error appending field ${key} to FormData:`, err);
//                         }
//                     }
//                 }
//             });
//
//             // Thêm cover image nếu có
//             if (product.coverImage instanceof File) {
//                 formData.append('coverImage', product.coverImage);
//             }
//
//             // Thêm product images nếu có
//             if (product.productImages && Array.isArray(product.productImages)) {
//                 product.productImages.forEach((img, index) => {
//                     if (img instanceof File) {
//                         formData.append(`productImages[${index}]`, img);
//                     }
//                 });
//             }
//
//             // Gửi request với FormData và timeout
//             const response = await fetch(`${API_URL}/staff/product/${id}`, {
//                 method: "PUT",
//                 headers: {
//                     'Authorization': getAuthHeaders().Authorization
//                 },
//                 body: formData,
//                 signal: AbortSignal.timeout(20000) // 20 seconds timeout cho upload ảnh
//             });
//
//             if (!response.ok) {
//                 let errorMessage = 'Không thể cập nhật sản phẩm';
//                 try {
//                     const errorData = await response.json();
//                     errorMessage = errorData.message || errorMessage;
//                     console.error('Server error response:', errorData);
//                 } catch (e) {
//                     console.error('Error parsing error response:', e);
//                 }
//
//                 if (response.status === 401 || response.status === 403) {
//                     localStorage.removeItem('token');
//                     errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
//                 } else if (response.status === 404) {
//                     errorMessage = 'Không tìm thấy sản phẩm cần cập nhật';
//                 }
//
//                 throw new Error(errorMessage);
//             }
//
//             const data = await response.json();
//             console.log('Product updated successfully:', data);
//             return data;
//         } else {
//             // Trường hợp không có file, sử dụng JSON như bình thường
//             const response = await fetch(`${API_URL}/staff/product/${id}`, {
//                 method: "PUT",
//                 headers: getAuthHeaders(),
//                 body: JSON.stringify(product),
//             });
//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || 'Failed to update product');
//             }
//             return await response.json();
//         }
//     } catch (error) {
//         console.error('API error:', error);
//         throw error;
//     }
// };
//
// export const deleteStaffProduct = async (id) => {
//     try {
//         console.log('Deleting product with ID:', id);
//         const token = localStorage.getItem('token');
//         if (!token) {
//             throw new Error('Vui lòng đăng nhập để tiếp tục');
//         }
//
//         const response = await fetch(`${API_URL}/staff/product/${id}`, {
//             method: "DELETE",
//             headers: getAuthHeaders(),
//             signal: AbortSignal.timeout(15000) // 15 seconds timeout
//         });
//
//         if (!response.ok) {
//             let errorMessage = 'Không thể xóa sản phẩm';
//             try {
//                 const errorData = await response.json();
//                 errorMessage = errorData.message || errorMessage;
//             } catch (e) {
//                 console.error('Error parsing error response:', e);
//             }
//
//             if (response.status === 401 || response.status === 403) {
//                 localStorage.removeItem('token');
//                 errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
//             } else if (response.status === 404) {
//                 errorMessage = 'Không tìm thấy sản phẩm cần xóa';
//             }
//
//             throw new Error(errorMessage);
//         }
//
//         const data = await response.json();
//         console.log('Product deleted successfully:', data);
//         return data;
//     } catch (error) {
//         console.error('API error when deleting product:', error);
//         if (error.name === 'AbortError') {
//             throw new Error('Kết nối đến máy chủ quá lâu, vui lòng thử lại');
//         }
//         throw error;
//     }
// };
//
// // CATEGORY
// export const fetchStaffCategories = async () => {
//     try {
//         const response = await fetch(`${API_URL}/staff/category`, {
//             headers: getAuthHeaders()
//         });
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(errorData.message || 'Failed to fetch categories');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('API error:', error);
//         throw error;
//     }
// };
//
// // PRODUCT TYPE
// export const fetchStaffProductTypes = async () => {
//     try {
//         const response = await fetch(`${API_URL}/staff/product-type`, {
//             headers: getAuthHeaders()
//         });
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(errorData.message || 'Failed to fetch product types');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('API error:', error);
//         throw error;
//     }
// };
//
// // BRAND
// export const fetchBrands = async () => {
//     try {
//         const response = await fetch(`${API_URL}/brand`, {
//             headers: getAuthHeaders()
//         });
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(errorData.message || 'Failed to fetch brands');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('API error:', error);
//         throw error;
//     }
// };
