const API_BASE_URL = 'http://localhost:9999/admin/customer-account';

// Function để lấy Bearer Token với nhiều key từ localStorage/sessionStorage
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
        'Content-Type': 'application/json',
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
    if (response.status === 401 || response.status === 403) {
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

// GET - Lấy tất cả customers với Bearer Token
export const getAllCustomers = async () => {
    try {
        console.log('👥 Fetching all customers from:', API_BASE_URL);

        // Tạo headers với Bearer Token
        const headers = createAuthHeaders();

        const response = await fetch(API_BASE_URL, {
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
        console.log('✅ Customers API response:', data);

        if (data && Array.isArray(data.accounts)) {
            return { success: true, data: data.accounts };
        } else if (Array.isArray(data)) {
            return { success: true, data: data };
        } else {
            console.error('❌ Invalid customers response structure:', data);
            return { success: false, error: 'Invalid response structure' };
        }
    } catch (error) {
        console.error('💥 Error fetching customers:', error);
        return { success: false, error: error.message };
    }
};

// GET - Lấy customer theo ID với Bearer Token
export const getCustomerById = async (customerId) => {
    try {
        console.log('🔍 Fetching customer by ID:', customerId);

        const headers = createAuthHeaders();

        const response = await fetch(`${API_BASE_URL}/${customerId}`, {
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
        console.log('✅ Customer detail response:', data);
        return { success: true, data: data.account || data };
    } catch (error) {
        console.error('💥 Error fetching customer by ID:', error);
        return { success: false, error: error.message };
    }
};
