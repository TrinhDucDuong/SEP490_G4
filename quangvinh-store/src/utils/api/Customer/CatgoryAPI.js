// Hàm lấy danh sách danh mục (category) từ API
// - Không cần truyền tham số
// - Gửi request GET đến endpoint /category
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch categories"
// - Nếu thành công, trả về dữ liệu JSON (danh sách danh mục)
export const fetchCategory = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories'); // Báo lỗi khi API không trả về thành công
    }
    return await response.json(); // Trả về dữ liệu JSON từ response
};
