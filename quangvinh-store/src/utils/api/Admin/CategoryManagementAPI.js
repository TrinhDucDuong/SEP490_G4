const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/staff/category`;

const getAuthToken = () => {
    return localStorage.getItem('adminAuthToken') || sessionStorage.getItem('adminAuthToken');
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'accept': '*/*',
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

export const getAllCategories = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.categories || [] };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: error.message };
    }
};

export const getCategoryById = async (categoryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.category };
    } catch (error) {
        console.error('Error fetching category:', error);
        return { success: false, error: error.message };
    }
};

export const createCategory = async (categoryData, categoryImage) => {
    try {
        const formData = new FormData();
        const categoryInputBlob = new Blob([JSON.stringify({
            categoryName: categoryData.categoryName,
            parentCategoryId: categoryData.parentCategoryId
        })], {
            type: 'application/json'
        });
        formData.append('categoryInputData', categoryInputBlob);

        if (categoryImage && categoryImage instanceof File) {
            formData.append('categoryImages', categoryImage);
        } else {
            const emptyFile = new File([''], 'no_image.txt', { type: 'text/plain', lastModified: Date.now() });
            formData.append('categoryImages', emptyFile);
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
        });
        const data = await handleResponse(response);
        return { success: true, data: data.category };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: error.message };
    }
};

export const updateCategory = async (categoryId, categoryData, categoryImage) => {
    try {
        const formData = new FormData();
        const categoryInputBlob = new Blob([JSON.stringify({
            categoryName: categoryData.categoryName,
            parentCategoryId: categoryData.parentCategoryId
        })], {
            type: 'application/json'
        });
        formData.append('categoryInputData', categoryInputBlob);

        if (categoryImage === null) {
            const emptyFile = new File([''], 'delete_image.txt', { type: 'text/plain', lastModified: Date.now() });
            formData.append('categoryImages', emptyFile);
        } else if (categoryImage === 'keep_existing') {
            const keepFile = new File(['KEEP_EXISTING'], 'keep_existing.marker', { type: 'text/plain', lastModified: Date.now() });
            formData.append('categoryImages', keepFile);
        } else if (categoryImage && categoryImage instanceof File) {
            formData.append('categoryImages', categoryImage);
        } else {
            const emptyFile = new File([''], 'empty.txt', { type: 'text/plain', lastModified: Date.now() });
            formData.append('categoryImages', emptyFile);
        }

        const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: formData
        });
        const data = await handleResponse(response);
        return { success: true, data: data.category };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: error.message };
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await handleResponse(response);
        return { success: true, data: data.category };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
    }
};
