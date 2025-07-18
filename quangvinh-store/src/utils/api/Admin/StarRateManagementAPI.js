const API_BASE_URL = 'http://localhost:9999';

// Hàm helper để lấy token từ localStorage hoặc sessionStorage
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

// Hàm helper để xử lý response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Ensure visibility status is properly tracked
    if (data.starRates) {
        data.starRates = data.starRates.map(rate => ({
            ...rate,
            isVisible: rate.isVisible !== false // Default to true if not specified
        }));
    }

    return data;
};

export const StarRateManagementAPI = {
    // Lấy tất cả đánh giá
    getAllStarRates: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/star-rate`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching star rates:', error);
            throw error;
        }
    },

    // Lấy đánh giá theo ID
    getStarRateById: async (starRateId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/star-rate/${starRateId}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error fetching star rate ${starRateId}:`, error);
            throw error;
        }
    },

    // Reply đánh giá
    replyStarRate: async (replyData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/star-rate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(replyData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error replying to star rate:', error);
            throw error;
        }
    },

    // Cập nhật reply
    updateReply: async (starRateId, updateData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/star-rate/${starRateId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updateData)
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error updating reply ${starRateId}:`, error);
            throw error;
        }
    },

    // Ẩn đánh giá
    hideStarRate: async (starRateId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/star-rate/${starRateId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error hiding star rate ${starRateId}:`, error);
            throw error;
        }
    },

    // Khôi phục đánh giá
    restoreStarRate: async (starRateId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/star-rate/${starRateId}`, {
                method: 'PATCH',
                headers: getAuthHeaders()
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`Error restoring star rate ${starRateId}:`, error);
            throw error;
        }
    }
};
