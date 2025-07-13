// src/utils/api/ProductManagementAPI.js

const API_BASE_URL = 'http://localhost:9999/staff/product';
const COLOR_API_URL = 'http://localhost:9999/staff/color';

// FIXED: Function để lấy Bearer Token với key đúng từ AuthContext
const getAuthToken = () => {
    // Tìm token với key đúng từ AuthContextForManager
    const token = localStorage.getItem('adminAuthToken') ||
        sessionStorage.getItem('adminAuthToken') ||
        localStorage.getItem('authToken') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('authToken') ||
        sessionStorage.getItem('accessToken') ||
        sessionStorage.getItem('token');

    console.log('🔑 Getting Bearer Token:', token ? 'Token found' : 'No token found');
    if (token) {
        console.log('🔑 Token preview:', token.substring(0, 20) + '...');
        console.log('🔑 Token length:', token.length);
    } else {
        console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
        console.log('🔍 Available sessionStorage keys:', Object.keys(sessionStorage));
    }

    return token;
};

// FIXED: Function để tạo headers với Bearer Token
const createAuthHeaders = (additionalHeaders = {}) => {
    const token = getAuthToken();
    const headers = {
        'accept': '*/*',
        ...additionalHeaders
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('✅ Bearer Token added to headers');
    } else {
        console.warn('⚠️ No Bearer Token found');
    }

    return headers;
};

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
        '#FFFFFF': 'Trắng',
        '#ae2929': 'Đỏ đô'
    };
    return colorMap[hex] || `Màu ${hex}`;
};

// FIXED: Function xử lý lỗi authentication
const handleAuthError = (response) => {
    if (response.status === 401) {
        console.error('🚫 Bearer Token expired or invalid');
        // Xóa tất cả token có thể (bao gồm adminAuthToken)
        localStorage.removeItem('adminAuthToken');
        sessionStorage.removeItem('adminAuthToken');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('token');
        localStorage.removeItem('bearerToken');
        localStorage.removeItem('jwt');

        // Cũng xóa user info
        localStorage.removeItem('adminUserInfo');
        sessionStorage.removeItem('adminUserInfo');

        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
};

// GET - Lấy tất cả products với Bearer Token
export const getAllProducts = async () => {
    try {
        console.log('📦 Fetching all products from:', API_BASE_URL);

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
        console.log('✅ Products API response:', data);

        // FIXED: Xử lý response structure nhất quán
        if (data && Array.isArray(data.products)) {
            return { success: true, data: data.products };
        } else if (Array.isArray(data)) {
            return { success: true, data: data };
        } else {
            console.error('❌ Invalid products response structure:', data);
            return { success: false, error: 'Invalid response structure' };
        }
    } catch (error) {
        console.error('💥 Error fetching products:', error);
        return { success: false, error: error.message };
    }
};

// GET - Lấy tất cả colors với Bearer Token
export const getAllColors = async () => {
    try {
        console.log('🎨 Fetching all colors from:', COLOR_API_URL);

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
        console.log('✅ Colors API response:', data);

        if (data && data.color && Array.isArray(data.color)) {
            const formattedColors = data.color.map((colorItem, colorIndex) => ({
                colorId: colorIndex + 1,
                colorName: getColorName(colorItem.colorHex),
                colorHex: colorItem.colorHex
            }));
            return { success: true, data: formattedColors };
        } else {
            console.error('❌ Invalid colors response structure:', data);
            return { success: false, error: 'Invalid response structure' };
        }
    } catch (error) {
        console.error('💥 Error fetching colors:', error);
        return { success: false, error: error.message };
    }
};

// FIXED: POST - Tạo sản phẩm mới với Bearer Token
export const createProduct = async (productData, productImages) => {
    try {
        console.log('📝 === CREATE PRODUCT START ===');
        console.log('📝 Product data received:', productData);
        console.log('📷 Images received:', productImages?.length || 0);

        // Validation trước khi gửi
        if (!productData.brandId || !productData.categoryId) {
            console.error('❌ Missing brandId or categoryId:', {
                brandId: productData.brandId,
                categoryId: productData.categoryId
            });
            return {
                success: false,
                error: 'Thiếu thông tin thương hiệu hoặc danh mục'
            };
        }

        if (!productData.productVariants || productData.productVariants.length === 0) {
            console.error('❌ Missing or empty productVariants');
            return {
                success: false,
                error: 'Sản phẩm phải có ít nhất một biến thể'
            };
        }

        // Kiểm tra Bearer Token
        const token = getAuthToken();
        if (!token) {
            console.error('🚫 No Bearer Token found for create request');
            return {
                success: false,
                error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                shouldRedirectToLogin: true
            };
        }

        const formData = new FormData();

        // FIXED: Cấu trúc productInput theo đúng schema backend
        const productInput = {
            productName: productData.productName?.trim(),
            productDescription: productData.productDescription?.trim() || '',
            unitPrice: productData.unitPrice.toString(),
            brandId: productData.brandId.toString(), // String theo schema
            categoryId: productData.categoryId.toString(), // String theo schema
            productVariants: productData.productVariants.map(variant => ({
                productSize: variant.productSize?.trim() || '',
                color: {
                    colorHex: variant.color?.trim() || '#000000'
                },
                quantity: parseInt(variant.quantity) || 0
            }))
        };

        console.log('📋 Final productInput for CREATE:', JSON.stringify(productInput, null, 2));

        const productInputBlob = new Blob([JSON.stringify(productInput)], {
            type: 'application/json'
        });
        formData.append('productInputData', productInputBlob);

        // FIXED: Xử lý images cho CREATE - vẫn gửi empty file nếu cần
        if (productImages && productImages.length > 0) {
            productImages.forEach((image) => {
                if (image instanceof File) {
                    formData.append('productImages', image);
                    console.log('📷 Added image:', image.name, 'size:', image.size);
                }
            });
        } else {
            // CREATE: Gửi file trống nếu không có ảnh (backend có thể yêu cầu)
            const emptyFile = new File([''], 'no_image.txt', {
                type: 'text/plain',
                lastModified: Date.now()
            });
            formData.append('productImages', emptyFile);
            console.log('📷 Added empty file (no images for CREATE)');
        }

        const headers = createAuthHeaders();

        console.log('📤 Sending CREATE request to:', API_BASE_URL);
        console.log('📤 Request headers:', headers);

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        console.log('📥 CREATE response status:', response.status);
        console.log('📥 CREATE response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            console.error('❌ Create product error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Create product success:', data);
        console.log('📝 === CREATE PRODUCT END ===');
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('💥 Error creating product:', error);
        return { success: false, error: error.message };
    }
};

// FIXED: PUT - Cập nhật sản phẩm với Bearer Token (không gửi empty file để giữ ảnh cũ)
export const updateProduct = async (productId, productData, productImages) => {
    try {
        console.log('🔄 === UPDATE PRODUCT START ===');
        console.log('🔄 Updating product:', productId, 'with data:', productData);
        console.log('📷 Number of new images:', productImages?.length || 0);

        // Validation trước khi gửi
        if (!productData.brandId || !productData.categoryId) {
            return {
                success: false,
                error: 'Thiếu thông tin thương hiệu hoặc danh mục'
            };
        }

        // Kiểm tra Bearer Token
        const token = getAuthToken();
        if (!token) {
            console.error('🚫 No Bearer Token found for update request');
            return {
                success: false,
                error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
                shouldRedirectToLogin: true
            };
        }

        const formData = new FormData();

        // FIXED: Cấu trúc productInput theo đúng schema backend
        const productInput = {
            productName: productData.productName?.trim(),
            productDescription: productData.productDescription?.trim() || '',
            unitPrice: productData.unitPrice.toString(),
            brandId: productData.brandId.toString(), // String theo schema
            categoryId: productData.categoryId.toString(), // String theo schema
            productVariants: productData.productVariants.map(variant => ({
                productSize: variant.productSize?.trim() || '',
                color: {
                    colorHex: variant.color?.trim() || '#000000'
                },
                quantity: parseInt(variant.quantity) || 0
            }))
        };

        console.log('📋 Processed update input:', productInput);

        const productInputBlob = new Blob([JSON.stringify(productInput)], {
            type: 'application/json'
        });
        formData.append('productInputData', productInputBlob);

        // FIXED: Xử lý images cho UPDATE - chỉ gửi khi có ảnh mới thực sự
        const hasNewImages = productImages && productImages.some(img => img instanceof File);

        if (hasNewImages) {
            console.log('📷 Adding new images to form data');
            productImages.forEach((image) => {
                if (image instanceof File) {
                    formData.append('productImages', image);
                    console.log('📷 Added new image:', image.name, 'size:', image.size);
                }
            });
        } else {
            console.log('📷 No new images - keeping existing images (not sending productImages field)');
            // FIXED: Không gửi field productImages để giữ nguyên ảnh cũ
        }

        const headers = createAuthHeaders();

        console.log('📤 Sending UPDATE request with Bearer Token to:', `${API_BASE_URL}/${productId}`);
        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'PUT',
            headers: headers,
            body: formData
        });

        console.log('📥 UPDATE response status:', response.status);

        if (!response.ok) {
            handleAuthError(response);
            const errorText = await response.text();
            console.error('❌ Update product error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Update product success:', data);
        console.log('🔄 === UPDATE PRODUCT END ===');
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('💥 Error updating product:', error);
        return { success: false, error: error.message };
    }
};

// DELETE - Xóa sản phẩm với Bearer Token
export const deleteProduct = async (productId) => {
    try {
        console.log('🗑️ Deleting product:', productId);

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
        console.log('✅ Delete product success:', data);
        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('💥 Error deleting product:', error);
        return { success: false, error: error.message };
    }
};

// GET - Lấy chi tiết sản phẩm theo ID với Bearer Token
export const getProductById = async (productId) => {
    try {
        console.log('🔍 Fetching product by ID:', productId);

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
        console.log('✅ Product detail response:', data);

        return { success: true, data: data.product || data };
    } catch (error) {
        console.error('💥 Error fetching product by ID:', error);
        return { success: false, error: error.message };
    }
};
