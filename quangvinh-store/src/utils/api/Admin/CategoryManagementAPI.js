const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/staff/category`;


export const getAllCategories = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.categories || [] };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: error.message };
    }
};

// GET - Lấy category theo ID
export const getCategoryById = async (categoryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
            method: 'GET',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.category };
    } catch (error) {
        console.error('Error fetching category:', error);
        return { success: false, error: error.message };
    }
};

// POST - Tạo category mới (sử dụng FormData giống Brand)
export const createCategory = async (categoryData, categoryImage) => {
    try {
        const formData = new FormData();

        // Tạo Blob với Content-Type application/json cho categoryInputData
        const categoryInputBlob = new Blob([JSON.stringify({
            categoryName: categoryData.categoryName,
            parentCategoryId: categoryData.parentCategoryId
        })], {
            type: 'application/json'
        });

        formData.append('categoryInputData', categoryInputBlob);

        // LUÔN LUÔN gửi categoryImages field (giống Brand)
        if (categoryImage && categoryImage instanceof File) {
            formData.append('categoryImages', categoryImage);
        } else {
            // Gửi empty file nếu không có ảnh
            const emptyFile = new File([''], 'no_image.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('categoryImages', emptyFile);
        }

        // Log FormData để debug
        console.log('Create FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'accept': '*/*'
                // Không set Content-Type - để browser tự động set multipart/form-data
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create category error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.category };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: error.message };
    }
};

// PUT - Cập nhật category (sử dụng FormData giống Brand)
export const updateCategory = async (categoryId, categoryData, categoryImage) => {
    try {
        const formData = new FormData();

        // Tạo Blob với Content-Type application/json cho categoryInputData
        const categoryInputBlob = new Blob([JSON.stringify({
            categoryName: categoryData.categoryName,
            parentCategoryId: categoryData.parentCategoryId
        })], {
            type: 'application/json'
        });

        formData.append('categoryInputData', categoryInputBlob);

        // Xử lý ảnh theo các trường hợp khác nhau
        if (categoryImage === null) {
            // Người dùng muốn xóa ảnh - gửi empty file
            const emptyFile = new File([''], 'delete_image.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('categoryImages', emptyFile);
        } else if (categoryImage === 'keep_existing') {
            // Giữ nguyên ảnh cũ - gửi marker file
            const keepFile = new File(['KEEP_EXISTING'], 'keep_existing.marker', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('categoryImages', keepFile);
        } else if (categoryImage && categoryImage instanceof File) {
            // Có ảnh mới - gửi file thực
            formData.append('categoryImages', categoryImage);
        } else {
            // Fallback - gửi empty file để tránh lỗi 400
            const emptyFile = new File([''], 'empty.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('categoryImages', emptyFile);
        }

        // Log FormData để debug
        console.log('Update FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*'
                // Không set Content-Type - để browser tự động set multipart/form-data
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update category error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.category };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: error.message };
    }
};

// DELETE - Xóa category (chuyển isActive = false)
export const deleteCategory = async (categoryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete category error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.category };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
    }
};

// Export object để tương thích với cả 2 cách import
export const CategoryManagementAPI = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
