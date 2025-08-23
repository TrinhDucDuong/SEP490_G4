// Hàm lấy danh sách màu sắc (color) từ API
// - Không cần truyền tham số
// - Gửi request GET đến endpoint /color
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch Color"
// - Nếu thành công, trả về dữ liệu JSON (danh sách màu sắc)
export const fetchColor = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/color`);
    if (!response.ok) {
        throw new Error('Failed to fetch Color'); // Báo lỗi khi API trả về trạng thái không thành công
    }
    return await response.json(); // Trả về dữ liệu JSON từ response
};
