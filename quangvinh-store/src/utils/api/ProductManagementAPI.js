// src/utils/api/ProductManagementAPI.js

const API_BASE_URL = 'http://localhost:9999/product'; // CẬP NHẬT URL MỚI
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

// GET - Lấy tất cả products - CẬP NHẬT ĐỂ SỬ DỤNG API MỚI
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
        console.log('Products fetched successfully:', data);

        // API mới đã có brand và category trong mỗi product
        if (data && data.products && Array.isArray(data.products)) {
            return { success: true, data: data.products };
        } else if (Array.isArray(data)) {
            return { success: true, data: data };
        } else {
            throw new Error('Invalid response structure');
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
        console.log('Colors fetched successfully:', data);

        if (data && data.color && Array.isArray(data.color)) {
            const formattedColors = data.color.map((colorItem, index) => ({
                colorId: index + 1,
                colorName: getColorName(colorItem.colorHex),
                colorHex: colorItem.colorHex
            }));
            return { success: true, data: formattedColors };
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error fetching colors:', error);
        return { success: false, error: error.message };
    }
};

// POST - Tạo product mới (giữ nguyên URL cũ cho staff)
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

        console.log('Product input data:', productInput);

        const productInputBlob = new Blob([JSON.stringify(productInput)], {
            type: 'application/json'
        });

        formData.append('productInputData', productInputBlob);

        if (productImages && productImages.length > 0) {
            productImages.forEach((image, index) => {
                if (image instanceof File) {
                    console.log(`Adding image ${index + 1}:`, image.name, image.type, image.size);
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

        // SỬ DỤNG URL CŨ CHO STAFF OPERATIONS
        const response = await fetch('http://localhost:9999/staff/product', {
            method: 'POST',
            headers: {
                'accept': '*/*'
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create product error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Product created successfully:', data);

        if (data && data.product) {
            return { success: true, data: data.product };
        } else if (data) {
            return { success: true, data: data };
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: error.message };
    }
};

// PUT - Cập nhật product (giữ nguyên URL cũ cho staff)
export const updateProduct = async (productId, productData, productImages) => {
    try {
        console.log('Updating product:', productId, 'with data:', productData);
        console.log('Number of new images:', productImages?.length || 0);

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

        console.log('Product update data:', productInput);

        const productInputBlob = new Blob([JSON.stringify(productInput)], {
            type: 'application/json'
        });

        formData.append('productInputData', productInputBlob);

        if (productImages && productImages.length > 0) {
            productImages.forEach((image, index) => {
                if (image instanceof File) {
                    console.log(`Adding new image ${index + 1}:`, image.name, image.type, image.size);
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

        // SỬ DỤNG URL CŨ CHO STAFF OPERATIONS
        const response = await fetch(`http://localhost:9999/staff/product/${productId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*'
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update product error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Product updated successfully:', data);

        if (data && data.product) {
            return { success: true, data: data.product };
        } else if (data) {
            return { success: true, data: data };
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: error.message };
    }
};

// DELETE - Xóa product (giữ nguyên URL cũ cho staff)
export const deleteProduct = async (productId) => {
    try {
        console.log('Deleting product:', productId);

        // SỬ DỤNG URL CŨ CHO STAFF OPERATIONS
        const response = await fetch(`http://localhost:9999/staff/product/${productId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete product error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Product deleted successfully:', data);

        if (data && data.product) {
            return { success: true, data: data.product };
        } else if (data) {
            return { success: true, data: data };
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
    }
};
