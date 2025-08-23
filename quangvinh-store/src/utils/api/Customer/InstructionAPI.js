// Hàm lấy danh sách hướng dẫn (instructions) từ API
// - Không cần truyền tham số
// - Gửi request GET đến endpoint /instruction
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch instructions"
// - Nếu thành công, trả về dữ liệu JSON (danh sách hướng dẫn)
export const fetchInstructions = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/instruction`);
    if (!response.ok) throw new Error('Failed to fetch instructions'); // Báo lỗi khi API trả về trạng thái không thành công
    return await response.json(); // Trả về dữ liệu JSON từ response
};
