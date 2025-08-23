// ================== API Giỏ hàng ==================

// Hàm lấy giỏ hàng của người dùng
// - Tham số: accountId (id tài khoản), token (JWT token để xác thực - có thể null)
// - Gửi request GET đến endpoint /cart?accountId={accountId}
// - Nếu request thất bại, trả về lỗi "Lỗi fetch giỏ hàng"
// - Nếu thành công, trả về dữ liệu JSON (danh sách sản phẩm trong giỏ hàng)
export const fetchCartAPI = async (accountId, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart?accountId=${accountId}`, {
        headers,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi fetch giỏ hàng');
    }
    return res.json();
};

// Hàm thêm sản phẩm vào giỏ hàng
// - Tham số: accountId, productId, colorHexCode, sizeCode, quantity, token
// - Gửi request POST đến endpoint /cart với body là thông tin sản phẩm cần thêm
// - Nếu request thất bại, trả về lỗi "Lỗi thêm sản phẩm vào giỏ hàng"
// - Nếu thành công, trả về dữ liệu JSON (giỏ hàng đã được cập nhật)
export const addToCartAPI = async ({accountId, productId, colorHexCode, sizeCode, quantity, token = null}) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
        method: 'POST',
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

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
// - Tham số: cartDetailsId (id chi tiết giỏ hàng), accountId, productId, colorHexCode, sizeCode, quantity, token
// - Gửi request PUT đến endpoint /cart với body là thông tin cập nhật
// - Nếu request thất bại, trả về lỗi "Lỗi cập nhật số lượng"
// - Nếu thành công, trả về dữ liệu JSON (giỏ hàng sau khi cập nhật)
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

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
        method: 'PUT',
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

// Hàm xóa sản phẩm khỏi giỏ hàng
// - Tham số: cartDetailsId (id chi tiết giỏ hàng cần xóa), token
// - Gửi request DELETE đến endpoint /cart/{cartDetailsId}
// - Nếu request thất bại, trả về lỗi "Lỗi xóa sản phẩm khỏi giỏ hàng"
// - Nếu thành công, trả về dữ liệu JSON (giỏ hàng sau khi xóa)
export const deleteCartItemAPI = async (cartDetailsId, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart/${cartDetailsId}`, {
        method: 'DELETE',
        headers,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi xóa sản phẩm khỏi giỏ hàng');
    }
    return res.json();
};
