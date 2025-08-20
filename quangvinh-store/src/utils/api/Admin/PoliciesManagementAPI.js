const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/staff/policy`;

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
    return data;
};

export const getAllPolicies = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.policies };
    } catch (error) {
        console.error('Error fetching policies:', error);
        return { success: false, error: error.message };
    }
};

export const getPolicyById = async (policyId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${policyId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.policy };
    } catch (error) {
        console.error('Error fetching policy:', error);
        return { success: false, error: error.message };
    }
};

export const createPolicy = async (policyData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                policyName: policyData.policyName,
                policyDescription: policyData.policyDescription
            })
        });
        const data = await handleResponse(response);
        return { success: true, data: data.policy };
    } catch (error) {
        console.error('Error creating policy:', error);
        return { success: false, error: error.message };
    }
};

export const updatePolicy = async (policyId, policyData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${policyId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                policyName: policyData.policyName,
                policyDescription: policyData.policyDescription
            })
        });
        const data = await handleResponse(response);
        return { success: true, data: data.policy };
    } catch (error) {
        console.error('Error updating policy:', error);
        return { success: false, error: error.message };
    }
};

export const deletePolicy = async (policyId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${policyId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.policy };
    } catch (error) {
        console.error('Error deleting policy:', error);
        return { success: false, error: error.message };
    }
};
