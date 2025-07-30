const API_BASE_URL = 'http://localhost:9999/staff/store';

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
    return data;
};

export const getAllStores = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        return { success: true, data: data.stores };
    } catch (error) {
        console.error('Error fetching stores:', error);
        return { success: false, error: error.message };
    }
};

export const getStoreById = async (storeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${storeId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        return { success: true, data: data.store };
    } catch (error) {
        console.error(`Error fetching store ${storeId}:`, error);
        return { success: false, error: error.message };
    }
};

export const createStore = async (storeData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                storeName: storeData.storeName,
                storeAddress: storeData.storeAddress,
                storePhone: storeData.storePhone,
                city: storeData.city,
                district: storeData.district,
                startWorkingAt: storeData.startWorkingAt,
                endWorkingAt: storeData.endWorkingAt,
                locationLat: storeData.locationLat,
                locationLng: storeData.locationLng
            })
        });

        const data = await handleResponse(response);
        return { success: true, data: data.store };
    } catch (error) {
        console.error('Error creating store:', error);
        return { success: false, error: error.message };
    }
};

export const updateStore = async (storeId, storeData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${storeId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                storeName: storeData.storeName,
                storeAddress: storeData.storeAddress,
                storePhone: storeData.storePhone,
                city: storeData.city,
                district: storeData.district,
                startWorkingAt: storeData.startWorkingAt,
                endWorkingAt: storeData.endWorkingAt,
                locationLat: storeData.locationLat,
                locationLng: storeData.locationLng
            })
        });

        const data = await handleResponse(response);
        return { success: true, data: data.store };
    } catch (error) {
        console.error(`Error updating store ${storeId}:`, error);
        return { success: false, error: error.message };
    }
};

export const deleteStore = async (storeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${storeId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        return { success: true, data: data.store };
    } catch (error) {
        console.error(`Error deleting store ${storeId}:`, error);
        return { success: false, error: error.message };
    }
};
