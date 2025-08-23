// Hàm lấy danh sách tất cả blog từ API
// - Không cần truyền tham số
// - Gửi request GET đến endpoint /blog
// - Nếu request thất bại, ném ra lỗi "Failed to fetch blog"
// - Nếu thành công, trả về dữ liệu JSON (danh sách blog)
export const fetchBlog = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog`);
    if (!response.ok) {
        throw new Error('Failed to fetch blog'); // Báo lỗi khi API không trả về thành công
    }
    return await response.json(); // Trả về dữ liệu JSON từ response
};

// Hàm lấy chi tiết một blog theo id
// - Tham số: id (id của blog cần lấy)
// - Gửi request GET đến endpoint /blog/{id}
// - Nếu request thất bại, ném ra lỗi "Failed to fetch blog"
// - Nếu thành công, trả về dữ liệu JSON (chi tiết blog)
export const fetchBlogById = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blog/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch blog'); // Báo lỗi khi API không trả về thành công
    }
    return await response.json(); // Trả về dữ liệu JSON từ response
};
