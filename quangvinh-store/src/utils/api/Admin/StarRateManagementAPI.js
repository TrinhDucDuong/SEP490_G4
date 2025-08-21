const API_BASE_URL = `${import.meta.env.VITE_API_BASE_STAFF}`;

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
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.starRates) {
        data.starRates = data.starRates.map(rate => ({
            ...rate,
            isVisible: rate.isVisible !== false
        }));
    }

    return data;
};

export const StarRateManagementAPI = {
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
