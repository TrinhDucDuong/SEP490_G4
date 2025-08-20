const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/sns`;

const getAuthToken = () => {
    const token = localStorage.getItem('adminAuthToken') ||
        sessionStorage.getItem('adminAuthToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('authToken') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('token');

    console.log('Getting Bearer Token:', token ? 'Token found' : 'No token found');
    if (token) {
        console.log('Token preview:', token.substring(0, 20) + '...');
    }

    return token;
};

const createAuthHeaders = (additionalHeaders = {}) => {
    const token = getAuthToken();
    const headers = {
        'accept': '*/*',
        'Content-Type': 'application/json',
        ...additionalHeaders
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Bearer Token added to headers');
    } else {
        console.warn('No Bearer Token found');
    }

    return headers;
};

const handleAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
        console.error('Bearer Token expired or invalid');
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

export const getAllSNS = async () => {
    try {
        console.log('Fetching all SNS...');

        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: createAuthHeaders()
        });

        handleAuthError(response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Get All SNS error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('SNS data fetched successfully:', data);
        return { success: true, data: data.snss || data };
    } catch (error) {
        console.error('Error fetching SNS:', error);
        return { success: false, error: error.message };
    }
};

export const getSNSById = async (snsId) => {
    try {
        console.log(`Fetching SNS with ID: ${snsId}`);

        const response = await fetch(`${API_BASE_URL}/${snsId}`, {
            method: 'GET',
            headers: createAuthHeaders()
        });

        handleAuthError(response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Get SNS by ID error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.sns || data };
    } catch (error) {
        console.error('Error fetching SNS:', error);
        return { success: false, error: error.message };
    }
};

export const createSNS = async (snsData) => {
    try {
        console.log('Creating SNS:', snsData);

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify({
                snsName: snsData.snsName,
                snsUrl: snsData.snsUrl,
                snsChatUrl: snsData.snsChatUrl
            })
        });

        handleAuthError(response);

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
        console.log('SNS created successfully:', data);
        return { success: true, data: data.sns || data };
    } catch (error) {
        console.error('Error creating SNS:', error);
        return { success: false, error: error.message };
    }
};

export const updateSNS = async (snsId, snsData) => {
    try {
        console.log(`Updating SNS ${snsId}:`, snsData);

        const response = await fetch(`${API_BASE_URL}/${snsId}`, {
            method: 'PUT', // Đổi từ POST thành PUT
            headers: createAuthHeaders(),
            body: JSON.stringify({
                snsName: snsData.snsName,
                snsUrl: snsData.snsUrl,
                snsChatUrl: snsData.snsChatUrl
            })
        });

        handleAuthError(response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update SNS error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('SNS updated successfully:', data);
        return { success: true, data: data.sns || data };
    } catch (error) {
        console.error('Error updating SNS:', error);
        return { success: false, error: error.message };
    }
};

export const deleteSNS = async (snsId) => {
    try {
        console.log(`Deleting SNS with ID: ${snsId}`);

        const response = await fetch(`${API_BASE_URL}/${snsId}`, {
            method: 'DELETE',
            headers: createAuthHeaders()
        });

        handleAuthError(response);

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
        console.log('SNS deleted successfully:', data);
        return { success: true, data: data.sns || data };
    } catch (error) {
        console.error('Error deleting SNS:', error);
        return { success: false, error: error.message };
    }
};
