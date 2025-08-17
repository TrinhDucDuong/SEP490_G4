// src/utils/api/admin/BannerManagementAPI.js
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/staff/banner`;

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

// Hàm helper để tạo headers cho multipart/form-data
const getAuthHeadersMultipart = () => {
    const token = getAuthToken();
    return {
        'accept': '*/*',
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

// GET - Lấy tất cả banners
export const getAllBanners = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await handleResponse(response);
        return { success: true, data: data.bannerImages };
    } catch (error) {
        console.error('Error fetching banners:', error);
        return { success: false, error: error.message };
    }
};

// POST - Tạo banner mới
export const createBanner = async (bannerImages) => {
    try {
        const formData = new FormData();

        // Thêm tất cả ảnh vào FormData
        if (bannerImages && bannerImages.length > 0) {
            bannerImages.forEach(image => {
                formData.append('bannerImages', image);
            });
        }

        // Log FormData để debug
        console.log('Create Banner FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeadersMultipart(),
            body: formData
        });

        const data = await handleResponse(response);
        return { success: true, data: data.bannerImages };
    } catch (error) {
        console.error('Error creating banner:', error);
        return { success: false, error: error.message };
    }
};

// PUT - Cập nhật trạng thái banners
export const updateBannerStatus = async (statusUpdates) => {
    try {
        const requestBody = {
            deActiveIds: statusUpdates.deActiveIds || [0],
            activeIds: statusUpdates.activeIds || [0]
        };

        console.log('Update Banner Status Request:', requestBody);

        const response = await fetch(API_BASE_URL, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(requestBody)
        });

        const data = await handleResponse(response);
        return { success: true, data };
    } catch (error) {
        console.error('Error updating banner status:', error);
        return { success: false, error: error.message };
    }
};
