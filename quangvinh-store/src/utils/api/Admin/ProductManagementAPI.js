import { apiManager } from './apiForManager';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/staff/product`;
const COLOR_API_URL = `${import.meta.env.VITE_API_BASE_URL}/staff/color`;

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
    if (response.status === 401) {
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

// GET
export const getAllProducts = async () => {
    try {
        console.log('Fetching all products from:', API_BASE_URL);
        const headers = createAuthHeaders({
            'Content-Type': 'application/json'
        });

        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Products API response:', data);

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

// GET
export const getProductById = async (productId) => {
    try {
        console.log('Fetching product by ID:', productId);
        const headers = createAuthHeaders({
            'Content-Type': 'application/json'
        });

        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('product detail response:', data);
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return { success: false, error: error.message };
    }
};

// GET
export const getAllColors = async () => {
    try {
        console.log('Fetching all colors from:', COLOR_API_URL);
        const headers = createAuthHeaders({
            'Content-Type': 'application/json'
        });

        const response = await fetch(COLOR_API_URL, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Colors API response:', data);

        if (data && data.color && Array.isArray(data.color)) {
            const formattedColors = data.color.map((colorItem, colorIndex) => ({
                colorId: colorIndex + 1,
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

// POST
export const createProduct = async (productData, productImages) => {
    try {
        console.log('Creating product with data:', productData);
        console.log('Number of images:', productImages?.length || 0);

        if (!productData.brandId || !productData.categoryId) {
            return {
                success: false,
                error: 'Thiếu thông tin thương hiệu hoặc danh mục'
            };
        }

        if (!productData.productVariants || productData.productVariants.length === 0) {
            return {
                success: false,
                error: 'Sản phẩm phải có ít nhất một biến thể'
            };
        }

        const token = getAuthToken();
        if (!token) {
            console.error('No Bearer Token found for create request');
            return {
                success: false,
                error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                shouldRedirectToLogin: true
            };
        }

        const formData = new FormData();
        const productInput = {
            productName: productData.productName?.trim(),
            productDescription: productData.productDescription?.trim() || '',
            unitPrice: productData.unitPrice.toString(),
            brandId: productData.brandId.toString(),
            categoryId: productData.categoryId.toString(),
            productVariants: productData.productVariants.map(variant => ({
                productSize: variant.productSize?.trim() || '',
                color: {
                    colorHex: variant.color?.trim() || '#000000'
                },
                quantity: parseInt(variant.quantity) || 0
            }))
        };

        console.log('Processed product input:', productInput);

        const productInputBlob = new Blob([JSON.stringify(productInput)], {
            type: 'application/json'
        });
        formData.append('productInputData', productInputBlob);

        if (productImages && productImages.length > 0) {
            productImages.forEach((image) => {
                if (image instanceof File) {
                    formData.append('productImages', image);
                }
            });
            console.log('Added', productImages.length, 'images to form data');
        } else {
            const emptyFile = new File([''], 'no_image.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('productImages', emptyFile);
            console.log('Added empty file (no images)');
        }

        const headers = createAuthHeaders();
        console.log('Sending CREATE request with Bearer Token');

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            console.error('Create product error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Create product success:', data);
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: error.message };
    }
};

export const updateProduct = async (productId, productData, productImages, existingImages) => {
    try {
        console.log('Updating product:', productId, 'with data:', productData);
        console.log('Number of new images:', productImages?.length || 0);
        console.log('Existing images:', existingImages);

        if (!productData.brandId || !productData.categoryId) {
            return {
                success: false,
                error: 'Thiếu thông tin thương hiệu hoặc danh mục'
            };
        }

        const token = localStorage.getItem('adminAuthToken') ||
            sessionStorage.getItem('adminAuthToken') ||
            localStorage.getItem('authToken') ||
            localStorage.getItem('accessToken') ||
            localStorage.getItem('token') ||
            sessionStorage.getItem('authToken') ||
            sessionStorage.getItem('accessToken') ||
            sessionStorage.getItem('token');

        if (!token) {
            console.error('No Bearer Token found for update request');
            return {
                success: false,
                error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                shouldRedirectToLogin: true
            };
        }

        const formData = new FormData();
        const productInput = {
            productName: productData.productName?.trim(),
            productDescription: productData.productDescription?.trim() || '',
            unitPrice: productData.unitPrice.toString(),
            brandId: productData.brandId.toString(),
            categoryId: productData.categoryId.toString(),
            productVariants: productData.productVariants.map(variant => {
                const variantObj = {
                    productSize: variant.productSize?.trim() || '',
                    color: { colorHex: variant.color?.trim() || '#000000' },
                    quantity: parseInt(variant.quantity) || 0
                };

                if (variant.productVariantId) {
                    variantObj.productVariantId = variant.productVariantId;
                }

                return variantObj;
            })
        };


        const productInputBlob = new Blob([JSON.stringify(productInput)], {
            type: 'application/json'
        });
        formData.append('productInputData', productInputBlob);

        if (productImages && productImages.length > 0) {
            productImages.forEach((image) => {
                if (image instanceof File) {
                    formData.append('productImages', image);
                }
            });
        }

        const headers = {
            'accept': '*/*',
            'Authorization': `Bearer ${getAuthToken()}`
        };

        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'PUT',
            headers,
            body: formData
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('adminAuthToken');
                sessionStorage.removeItem('adminAuthToken');
                localStorage.removeItem('authToken');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('token');
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('token');
                throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            }

            const errorText = await response.text();
            console.error('Update product error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Update product success:', data);
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: error.message };
    }
};

// DELETE
export const deleteProduct = async (productId) => {
    try {
        console.log('Deleting product:', productId);
        const headers = createAuthHeaders({
            'Content-Type': 'application/json'
        });

        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Delete product success:', data);
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
    }
};
