// Hàm lấy thông tin người dùng (User Profile)
// - Tham số: token (JWT Token để xác thực người dùng)
// - Gửi request GET đến endpoint /profile với header:
//    + Content-Type: application/json
//    + Authorization: Bearer <token>
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch user profile"
// - Nếu thành công, trả về dữ liệu JSON chứa thông tin user
export const fetchUser = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile'); // Báo lỗi khi API trả về trạng thái thất bại
    }

    return await response.json(); // Trả về dữ liệu JSON (thông tin người dùng)
};
