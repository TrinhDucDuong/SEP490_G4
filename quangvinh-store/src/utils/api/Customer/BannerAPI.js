// Hàm lấy dữ liệu banner từ API
// - Không cần truyền tham số
// - Gửi request GET đến endpoint /banner
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch categories"
// - Nếu thành công, trả về dữ liệu JSON từ response
export const fetchBanner = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/banner`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories'); // Báo lỗi khi API trả về trạng thái không thành công
    }
    return await response.json(); // Trả về dữ liệu JSON
};
