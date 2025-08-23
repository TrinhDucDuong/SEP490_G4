// Hàm lấy danh sách thương hiệu (brand) từ API
// - Không cần truyền tham số
// - Gửi request GET đến endpoint /brand
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch brand"
// - Nếu thành công, trả về dữ liệu JSON (danh sách thương hiệu)
export const fetchBrand = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/brand`);
    if (!response.ok) {
        throw new Error('Failed to fetch brand'); // Báo lỗi khi API trả về trạng thái không thành công
    }
    return await response.json(); // Trả về dữ liệu JSON từ response
};
