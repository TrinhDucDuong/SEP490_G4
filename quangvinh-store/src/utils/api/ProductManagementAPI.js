// src/utils/api/ProductManagementAPI.js

const API_BASE_URL = 'http://localhost:9999/staff/product';
const COLOR_API_URL = 'http://localhost:9999/staff/color';

// Helper function để tự động tạo tên màu từ hex
const getColorName = (hex) => {
    const colorMap = {
        '#000000': 'Đen',
        '#0000FF': 'Xanh dương',
        '#008000': 'Xanh lá',
        '#00FFFF': 'Xanh lơ',
        '#228B22': 'Xanh lá đậm',
        '#4B0082': 'Chàm',
        '#800080': 'Tím',
        '#808080': 'Xám',
        '#A52A2A': 'Nâu',
        '#C0C0C0': 'Bạc',
        '#DC143C': 'Đỏ thẫm',
        '#F0E68C': 'Vàng nhạt',
        '#FF0000': 'Đỏ',
        '#FF00FF': 'Hồng tím',
        '#FF4500': 'Cam đỏ',
        '#FFA500': 'Cam',
        '#FFC0CB': 'Hồng',
        '#FFD700': 'Vàng kim',
        '#FFFF00': 'Vàng',
        '#FFFFFF': 'Trắng'
    };

    return colorMap[hex] || `Màu ${hex}`;
};

// GET - Lấy tất cả products
export const getAllProducts = async () => {
    try {
        console.log('Fetching all products from:', API_BASE_URL);

        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Products API response:', data);

        // XỬ LÝ RESPONSE STRUCTURE - Products có thể trả về trực tiếp array hoặc object
        if (data && Array.isArray(data.products)) {
            return { success: true, data: data.products };
        } else if (Array.isArray(data)) {
            return { success: true, data: data };
        } else {
            console.error('Invalid products response structure:', data);
            return { success: false, error: 'Invalid response structure' };
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: error.message };
    }
};

// GET - Lấy tất cả colors
export const getAllColors = async () => {
    try {
        console.log('Fetching all colors from:', COLOR_API_URL);

        const response = await fetch(COLOR_API_URL, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Colors API response:', data);

        // XỬ LÝ FORMAT MỚI - chuyển từ {colorHex: "#000000"} thành format dễ sử dụng
        if (data && data.color && Array.isArray(data.color)) {
            const formattedColors = data.color.map((colorItem, index) => ({
                colorId: index + 1,
                colorName: getColorName(colorItem.colorHex),
                colorHex: colorItem.colorHex
            }));
            return { success: true, data: formattedColors };
        } else {
            console.error('Invalid colors response structure:', data);
            return { success: false, error: 'Invalid response structure' };
        }
    } catch (error) {
        console.error('Error fetching colors:', error);
        return { success: false, error: error.message };
    }
};

// Các function khác giữ nguyên...
export const createProduct = async (productData, productImages) => {
    try {
        console.log('Creating product with data:', productData);
        console.log('Number of images:', productImages?.length || 0);

        const formData = new FormData();

        const productInput = {
            productName: productData.productName?.trim(),
            productDescription: productData.productDescription?.trim() || '',
            unitPrice: productData.unitPrice.toString(),
            brandId: parseInt(productData.brandId),
            categoryId: parseInt(productData.categoryId),
            productVariants: productData.productVariants.map(variant => ({
                color: variant.color?.trim() || '',
                productSize: variant.productSize?.trim() || '',
                quantity: parseInt(variant.quantity) || 0
            }))
        };

        const productInputBlob = new Blob([JSON.stringify(productInput)], {
            type: 'application/json'
        });

        formData.append('productInputData', productInputBlob);

        if (productImages && productImages.length > 0) {
            productImages.forEach((image, index) => {
                if (image instanceof File) {
                    formData.append('productImages', image);
                }
            });
        } else {
            const emptyFile = new File([''], 'no_image.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('productImages', emptyFile);
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'accept': '*/*'
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: error.message };
    }
};

export const updateProduct = async (productId, productData, productImages) => {
    try {
        console.log('Updating product:', productId, 'with data:', productData);

        const formData = new FormData();

        const productInput = {
            productName: productData.productName?.trim(),
            productDescription: productData.productDescription?.trim() || '',
            unitPrice: productData.unitPrice.toString(),
            brandId: parseInt(productData.brandId),
            categoryId: parseInt(productData.categoryId),
            productVariants: productData.productVariants.map(variant => ({
                color: variant.color?.trim() || '',
                productSize: variant.productSize?.trim() || '',
                quantity: parseInt(variant.quantity) || 0
            }))
        };

        const productInputBlob = new Blob([JSON.stringify(productInput)], {
            type: 'application/json'
        });

        formData.append('productInputData', productInputBlob);

        if (productImages && productImages.length > 0) {
            productImages.forEach((image, index) => {
                if (image instanceof File) {
                    formData.append('productImages', image);
                }
            });
        } else {
            const emptyFile = new File([''], 'keep_existing.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('productImages', emptyFile);
        }

        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*'
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: error.message };
    }
};

export const deleteProduct = async (productId) => {
    try {
        console.log('Deleting product:', productId);

        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
    }
};
