const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/staff/brand`;


export const getAllBrands = async () => {
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
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.brand };
    } catch (error) {
        console.error('Error fetching brand:', error);
        return { success: false, error: error.message };
    }
};

// POST - Tạo brand mới - FIXED để luôn gửi brandImages
export const createBrand = async (brandData, brandImage) => {
    try {
        const formData = new FormData();

        // Tạo Blob với Content-Type application/json cho brandInputData
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
            // Gửi empty file nếu không có ảnh
            const emptyFile = new File([''], 'no_image.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('brandImages', emptyFile);
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
            console.error('Create brand error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.brand };
    } catch (error) {
        console.error('Error creating brand:', error);
        return { success: false, error: error.message };
    }
};

// PUT - Cập nhật brand - FIXED để luôn gửi brandImages
export const updateBrand = async (brandId, brandData, brandImage) => {
    try {
        const formData = new FormData();

        // Tạo Blob với Content-Type application/json cho brandInputData
        const brandInputBlob = new Blob([JSON.stringify({
            brandName: brandData.brandName,
            brandDescription: brandData.brandDescription
        })], {
            type: 'application/json'
        });

        formData.append('brandInputData', brandInputBlob);

        // FIXED: LUÔN LUÔN gửi brandImages field
        if (brandImage === null) {
            // Người dùng muốn xóa ảnh - gửi empty file
            const emptyFile = new File([''], 'delete_image.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('brandImages', emptyFile);
        } else if (brandImage === 'keep_existing') {
            // Giữ nguyên ảnh cũ - gửi marker file
            const keepFile = new File(['KEEP_EXISTING'], 'keep_existing.marker', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('brandImages', keepFile);
        } else if (brandImage && brandImage instanceof File) {
            // Có ảnh mới - gửi file thực
            formData.append('brandImages', brandImage);
        } else {
            // Fallback - gửi empty file để tránh lỗi 400
            const emptyFile = new File([''], 'empty.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('brandImages', emptyFile);
        }

        // Log FormData để debug
        console.log('Update FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await fetch(`${API_BASE_URL}/${brandId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*'
                // Không set Content-Type - để browser tự động set multipart/form-data
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update brand error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.brand };
    } catch (error) {
        console.error('Error updating brand:', error);
        return { success: false, error: error.message };
    }
};

// DELETE - Xóa brand (chuyển isActive = false)
export const deleteBrand = async (brandId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${brandId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete brand error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.brand };
    } catch (error) {
        console.error('Error deleting brand:', error);
        return { success: false, error: error.message };
    }
};
