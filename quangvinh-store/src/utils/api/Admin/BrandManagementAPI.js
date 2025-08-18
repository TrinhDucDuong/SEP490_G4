const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/staff/brand`;

// Hàm helper để lấy token từ localStorage hoặc sessionStorage
const getAuthToken = () => {
    return localStorage.getItem('adminAuthToken') || sessionStorage.getItem('adminAuthToken');
};

// Hàm helper để tạo headers với Bearer token
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'accept': '*/*',
        // Chỉ thêm Content-Type ở những request có JSON, không cần ở multipart/form-data
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

export const getAllBrands = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.brands };
    } catch (error) {
        console.error('Error fetching brands:', error);
        return { success: false, error: error.message };
    }
};

export const getBrandById = async (brandId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${brandId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.brand };
    } catch (error) {
        console.error('Error fetching brand:', error);
        return { success: false, error: error.message };
    }
};

export const createBrand = async (brandData, brandImage) => {
    try {
        const formData = new FormData();
        const brandInputBlob = new Blob([JSON.stringify({
            brandName: brandData.brandName,
            brandDescription: brandData.brandDescription
        })], {
            type: 'application/json'
        });
        formData.append('brandInputData', brandInputBlob);

        // LUÔN LUÔN gửi brandImages field
        if (brandImage && brandImage instanceof File) {
            formData.append('brandImages', brandImage);
        } else {
            const emptyFile = new File([''], 'no_image.txt', { type: 'text/plain', lastModified: Date.now() });
            formData.append('brandImages', emptyFile);
        }

        // Chỉ truyền accept + Authorization, không truyền Content-Type với FormData
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        });
        const data = await handleResponse(response);
        return { success: true, data: data.brand };
    } catch (error) {
        console.error('Error creating brand:', error);
        return { success: false, error: error.message };
    }
};

export const updateBrand = async (brandId, brandData, brandImage) => {
    try {
        const formData = new FormData();
        const brandInputBlob = new Blob([JSON.stringify({
            brandName: brandData.brandName,
            brandDescription: brandData.brandDescription
        })], {
            type: 'application/json'
        });
        formData.append('brandInputData', brandInputBlob);

        // LUÔN LUÔN gửi brandImages field với logic xử lý như cũ
        if (brandImage === null) {
            const emptyFile = new File([''], 'delete_image.txt', { type: 'text/plain', lastModified: Date.now() });
            formData.append('brandImages', emptyFile);
        } else if (brandImage === 'keep_existing') {
            const keepFile = new File(['KEEP_EXISTING'], 'keep_existing.marker', { type: 'text/plain', lastModified: Date.now() });
            formData.append('brandImages', keepFile);
        } else if (brandImage && brandImage instanceof File) {
            formData.append('brandImages', brandImage);
        } else {
            const emptyFile = new File([''], 'empty.txt', { type: 'text/plain', lastModified: Date.now() });
            formData.append('brandImages', emptyFile);
        }

        const response = await fetch(`${API_BASE_URL}/${brandId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: formData
        });
        const data = await handleResponse(response);
        return { success: true, data: data.brand };
    } catch (error) {
        console.error('Error updating brand:', error);
        return { success: false, error: error.message };
    }
};

export const deleteBrand = async (brandId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${brandId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.brand };
    } catch (error) {
        console.error('Error deleting brand:', error);
        return { success: false, error: error.message };
    }
};
