// Hàm lấy danh sách chính sách (policies) từ API
// - Không cần truyền tham số
// - Gửi request GET đến endpoint /policy
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch policies"
// - Nếu thành công, trả về dữ liệu JSON (danh sách chính sách)
export const fetchPolicies = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/policy`);
    if (!response.ok) throw new Error('Failed to fetch policies'); // Báo lỗi khi API trả về trạng thái không thành công
    return await response.json(); // Trả về dữ liệu JSON từ response
};
