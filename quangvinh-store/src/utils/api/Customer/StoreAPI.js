// Đối tượng StoreAPI chứa các hàm gọi API liên quan đến cửa hàng (store)
export const StoreAPI = {
    // Hàm lấy danh sách cửa hàng từ API
    // - Không cần truyền tham số
    // - Gửi request GET đến endpoint /store
    // - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch stores"
    // - Nếu thành công, parse dữ liệu JSON và trả về mảng stores
    // - Nếu API không trả về stores, mặc định trả về []
    fetchStores: async () => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/store`);
        if (!response.ok) {
            throw new Error("Failed to fetch stores"); // Báo lỗi khi gọi API thất bại
        }
        const data = await response.json();
        console.log(data); // Debug: in dữ liệu trả về từ API
        return data.stores || [];
    }
};
