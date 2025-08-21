import { DASHBOARD_CONSTANTS } from '../../constants/DashboardConstants';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_ADMIN}`;

const getAuthToken = () => {
    return localStorage.getItem('adminAuthToken') || sessionStorage.getItem('adminAuthToken');
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'accept': '*/*',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const handleResponse = async (response) => {
    if (response.status === 401) {
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
