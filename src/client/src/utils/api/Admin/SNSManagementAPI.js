// src/utils/api/Admin/SNSManagementAPI.js
const API_BASE_URL = 'http://localhost:9999/admin/sns';

// Hàm helper để lấy token từ localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
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

export const getAllSNS = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.snss };
    } catch (error) {
        console.error('Error fetching SNS:', error);
        return { success: false, error: error.message };
    }
};

export const getSNSById = async (snsId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${snsId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.sns };
    } catch (error) {
        console.error('Error fetching SNS:', error);
        return { success: false, error: error.message };
    }
};

export const createSNS = async (snsData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                snsName: snsData.snsName,
                snsUrl: snsData.snsUrl,
                snsChatUrl: snsData.snsChatUrl
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create SNS error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.sns };
    } catch (error) {
        console.error('Error creating SNS:', error);
        return { success: false, error: error.message };
    }
};

export const updateSNS = async (snsId, snsData) => {
    try {
        const response = await fetch(API_BASE_URL, {  // API_BASE_URL = 'http://localhost:9999/admin/sns'
            method: 'POST',  // POST chứ không phải PUT
            headers: getAuthHeaders(),
            body: JSON.stringify({
                snsId: snsId,
                snsName: snsData.snsName,
                snsUrl: snsData.snsUrl,
                snsChatUrl: snsData.snsChatUrl
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.sns };
    } catch (error) {
        console.error('Error updating SNS:', error);
        return { success: false, error: error.message };
    }
};

export const deleteSNS = async (snsId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${snsId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete SNS error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.sns };
    } catch (error) {
        console.error('Error deleting SNS:', error);
        return { success: false, error: error.message };
    }
};
