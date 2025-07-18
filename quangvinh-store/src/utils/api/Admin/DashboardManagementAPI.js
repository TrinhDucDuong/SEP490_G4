import { DASHBOARD_CONSTANTS } from '../../constants/DashboardConstants';

const API_BASE_URL = 'http://localhost:9999';

// Hàm helper để lấy token từ localStorage (tương tự SNSManagementAPI)
const getAuthToken = () => {
    return localStorage.getItem('adminAuthToken') || sessionStorage.getItem('adminAuthToken');
};

// Hàm helper để tạo headers với Bearer token
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'accept': '*/*',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Helper function để xử lý response và lỗi authentication
const handleResponse = async (response) => {
    if (response.status === 401) {
        // Token hết hạn hoặc không hợp lệ - xóa token và redirect
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminUserInfo');
        sessionStorage.removeItem('adminAuthToken');
        sessionStorage.removeItem('adminUserInfo');
        window.location.href = '/admin/login';
        throw new Error('Authentication failed');
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    return await response.json();
};

export const DashboardManagementAPI = {
    // Lấy thống kê tổng quan
    getSummary: async (filterBy) => {
        try {
            const response = await fetch(`${API_BASE_URL}${DASHBOARD_CONSTANTS.API_ENDPOINTS.SUMMARY}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ filterBy })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching summary:', error);
            throw error;
        }
    },

    // Lấy dữ liệu biểu đồ doanh thu theo thời gian
    getGraphRevenue: async (startTime, endTime) => {
        try {
            const response = await fetch(`${API_BASE_URL}${DASHBOARD_CONSTANTS.API_ENDPOINTS.GRAPH_REVENUE}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ startTime, endTime })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching graph revenue:', error);
            throw error;
        }
    },

    // Lấy dữ liệu doanh thu theo danh mục
    getCategoriesSales: async (startTime, endTime) => {
        try {
            const response = await fetch(`${API_BASE_URL}${DASHBOARD_CONSTANTS.API_ENDPOINTS.CATEGORIES_SALES}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ startTime, endTime })
            });

            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching categories sales:', error);
            throw error;
        }
    }
};
