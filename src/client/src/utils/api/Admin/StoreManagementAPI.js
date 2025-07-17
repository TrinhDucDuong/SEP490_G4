const API_BASE_URL = 'http://localhost:9999/staff/store';

const getAuthToken = () => localStorage.getItem('token');
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'accept': '*/*',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const getAllStores = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return { success: true, data: data.stores };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getStoreById = async (storeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${storeId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return { success: true, data: data.store };
    } catch (error) {
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
                storeAddress: storeData.storeAddress
            })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        return { success: true, data: data.store };
    } catch (error) {
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
                storeAddress: storeData.storeAddress
            })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        return { success: true, data: data.store };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteStore = async (storeId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${storeId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        return { success: true, data: data.store };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
