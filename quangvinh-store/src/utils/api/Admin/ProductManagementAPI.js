// src/utils/api/ProductManagementAPI.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999/staff/product';

// Helper function để lấy token
const getAuthToken = () => {
    const token = localStorage.getItem('adminAuthToken') || sessionStorage.getItem('adminAuthToken');
    console.log('Getting token:', token ? 'Token found' : 'No token');
    return token;
};

// Tạo axios instance với interceptor
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động thêm token vào header
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request:', config.headers.Authorization.substring(0, 20) + '...');
        } else {
            console.warn('No token available for request');
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Interceptor để xử lý lỗi response
apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response success:', response.status);
        return response;
    },
    (error) => {
        console.error('API Response error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            console.warn('401 Unauthorized - Token may be invalid');
            localStorage.removeItem('adminAuthToken');
            sessionStorage.removeItem('adminAuthToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export const ProductManagementAPI = {
    // POST - Tạo sản phẩm mới (CẦN TOKEN)
    createProduct: async (productData, images) => {
        try {
            console.log('Creating product with data:', productData);
            console.log('Images count:', images?.length || 0);

            const formData = new FormData();

            // Thêm dữ liệu sản phẩm
            formData.append('productInputData', JSON.stringify(productData));

            // Thêm hình ảnh
            if (images && images.length > 0) {
                images.forEach((image) => {
                    if (image instanceof File) {
                        formData.append('productImages', image);
                        console.log('Added image:', image.name);
                    }
                });
            }

            const token = getAuthToken();
            if (!token) {
                throw new Error('Không có token xác thực');
            }

            const response = await axios.post(API_BASE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log('Create product response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Create product API error:', error);
            if (error.response?.status === 401) {
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            throw new Error(error.response?.data?.message || 'Không thể tạo sản phẩm mới');
        }
    },

    // PUT - Cập nhật sản phẩm (CẦN TOKEN)
    updateProduct: async (id, productData, images) => {
        try {
            console.log('Updating product ID:', id, 'with data:', productData);

            const formData = new FormData();

            // Thêm dữ liệu sản phẩm
            formData.append('productInputData', JSON.stringify(productData));

            // Thêm hình ảnh nếu có
            if (images && images.length > 0) {
                images.forEach((image) => {
                    if (image instanceof File) {
                        formData.append('productImages', image);
                        console.log('Added image for update:', image.name);
                    }
                });
            }

            const token = getAuthToken();
            if (!token) {
                throw new Error('Không có token xác thực');
            }

            const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log('Update product response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Update product API error:', error);
            if (error.response?.status === 401) {
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            throw new Error(error.response?.data?.message || `Không thể cập nhật sản phẩm với ID: ${id}`);
        }
    },

    // GET - Lấy tất cả sản phẩm (không cần token)
    getAllProducts: async () => {
        try {
            const response = await apiClient.get('');
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải danh sách sản phẩm');
        }
    },

    // DELETE - Xóa sản phẩm (CẦN TOKEN)
    deleteProduct: async (id) => {
        try {
            const response = await apiClient.delete(`/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }
            throw new Error(`Không thể xóa sản phẩm với ID: ${id}`);
        }
    },
};
