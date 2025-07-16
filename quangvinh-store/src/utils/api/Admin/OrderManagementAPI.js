// src/utils/api/OrderManagementAPI.js
const API_BASE_URL = 'http://localhost:9999/staff/order';

// Function để lấy Bearer Token với key đúng từ AuthContext
const getAuthToken = () => {
    const token = localStorage.getItem('adminAuthToken') ||
        sessionStorage.getItem('adminAuthToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('authToken') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('token');

    console.log('🔑 Getting Bearer Token:', token ? 'Token found' : 'No token found');
    if (token) {
        console.log('🔑 Token preview:', token.substring(0, 20) + '...');
    }

    return token;
};

// Function để tạo headers với Bearer Token
const createAuthHeaders = (additionalHeaders = {}) => {
    const token = getAuthToken();
    const headers = {
        'accept': '*/*',
        ...additionalHeaders
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('✅ Bearer Token added to headers');
    } else {
        console.warn('⚠️ No Bearer Token found');
    }

    return headers;
};

// Function xử lý lỗi authentication
const handleAuthError = (response) => {
    if (response.status === 401) {
        console.error('🚫 Bearer Token expired or invalid');
        // Clear all possible token keys
        localStorage.removeItem('adminAuthToken');
        sessionStorage.removeItem('adminAuthToken');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('token');
        localStorage.removeItem('adminUserInfo');
        sessionStorage.removeItem('adminUserInfo');
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
};

// GET - Lấy tất cả orders với Bearer Token
export const getAllOrders = async (params = {}) => {
    try {
        console.log('📦 Fetching all orders from:', API_BASE_URL);

        const queryParams = new URLSearchParams();

        // Kiểm tra và validate tham số trước khi thêm vào queryParams
        if (params.orderStatus) {
            queryParams.append('orderStatus', params.orderStatus);
        }

        // Đảm bảo sortBy có giá trị hợp lệ
        const validSortFields = ['orderDate', 'orderId', 'totalPrice', 'orderStatus'];
        if (params.sortBy && validSortFields.includes(params.sortBy)) {
            queryParams.append('sortBy', params.sortBy);
        }

        // Đảm bảo sortDirection có giá trị hợp lệ
        const validSortDirections = ['asc', 'desc'];
        if (params.sortDirection && validSortDirections.includes(params.sortDirection)) {
            queryParams.append('sortDirection', params.sortDirection);
        }

        const url = queryParams.toString() ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;
        console.log('🌐 Request URL:', url);

        // Tạo headers với Bearer Token
        const headers = createAuthHeaders({
            'Content-Type': 'application/json'
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Orders API response:', data);

        if (data && Array.isArray(data.orders)) {
            return { success: true, data: data.orders };
        } else if (Array.isArray(data)) {
            return { success: true, data: data };
        } else {
            console.error('❌ Invalid orders response structure:', data);
            return { success: false, error: 'Invalid response structure' };
        }
    } catch (error) {
        console.error('💥 Error fetching orders:', error);
        return { success: false, error: error.message };
    }
};

// GET - Lấy order theo ID với Bearer Token
export const getOrderById = async (orderId) => {
    try {
        console.log('🔍 Fetching order by ID:', orderId);

        const headers = createAuthHeaders({
            'Content-Type': 'application/json'
        });

        const response = await fetch(`${API_BASE_URL}/${orderId}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Order detail response:', data);
        return { success: true, data: data.order || data };
    } catch (error) {
        console.error('💥 Error fetching order by ID:', error);
        return { success: false, error: error.message };
    }
};

// PUT - Cập nhật trạng thái order với Bearer Token
export const updateOrderStatus = async (orderId, orderStatus) => {
    try {
        console.log('🔄 Updating order status:', orderId, 'to:', orderStatus);

        const headers = createAuthHeaders({
            'Content-Type': 'application/json'
        });

        const response = await fetch(`${API_BASE_URL}/${orderId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ orderStatus })
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            console.error('❌ Update order status error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Update order status success:', data);
        return { success: true, data: data.order || data };
    } catch (error) {
        console.error('💥 Error updating order status:', error);
        return { success: false, error: error.message };
    }
};

// DELETE - Xóa order với Bearer Token
export const deleteOrder = async (orderId) => {
    try {
        console.log('🗑️ Deleting order:', orderId);

        const headers = createAuthHeaders({
            'Content-Type': 'application/json'
        });

        const response = await fetch(`${API_BASE_URL}/${orderId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Delete order success:', data);
        return { success: true, data: data.order || data };
    } catch (error) {
        console.error('💥 Error deleting order:', error);
        return { success: false, error: error.message };
    }
};
