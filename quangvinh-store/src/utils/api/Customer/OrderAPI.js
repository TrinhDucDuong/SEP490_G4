// Hàm lấy chi tiết đơn hàng theo orderId
// - Tham số:
//   + token (JWT token dùng để xác thực người dùng)
//   + orderId (id của đơn hàng cần lấy chi tiết)
// - Gửi request GET đến endpoint /order/{orderId}
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch order"
// - Nếu thành công, trả về dữ liệu JSON (chi tiết đơn hàng)
export const fetchOrderById = async (token, orderId) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order/${orderId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }

    return await response.json();
};
