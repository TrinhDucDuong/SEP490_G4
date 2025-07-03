export const fetchCartAPI = async (accountId, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`http://localhost:9999/cart?accountId=${accountId}`, {
        headers,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi fetch giỏ hàng');
    }
    return res.json();
};

export const addToCartAPI = async ({accountId, productId, colorHexCode, sizeCode, quantity, token = null}) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('http://localhost:9999/cart', {
        method: 'POST', // Sửa từ PUT thành POST
        headers,
        body: JSON.stringify({
            accountId,
            productId,
            colorHexCode,
            sizeCode,
            quantity,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi thêm sản phẩm vào giỏ hàng');
    }
    return res.json();
};

export const updateCartQuantityAPI = async ({
                                                cartDetailsId,
                                                accountId,
                                                productId,
                                                colorHexCode,
                                                sizeCode,
                                                quantity,
                                                token = null
                                            }) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`http://localhost:9999/cart`, {
        method: 'POST', // Hoặc PUT nếu server yêu cầu; cần xác nhận với backend
        headers,
        body: JSON.stringify({
            cartDetailsId,
            accountId,
            productId,
            colorHexCode,
            sizeCode,
            quantity,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi cập nhật số lượng');
    }
    return res.json();
};

export const deleteCartItemAPI = async (cartDetailsId, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`http://localhost:9999/cart/${cartDetailsId}`, {
        method: 'DELETE',
        headers,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi xóa sản phẩm khỏi giỏ hàng');
    }
    return res.json();
};