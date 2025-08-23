export const RecommendationAPI = {
    // Hàm lấy danh sách sản phẩm gợi ý (Recommendation)
    // - Gửi request POST đến endpoint /recommendation/cache
    // - Headers:
    //    + Accept: '*/*' (chấp nhận mọi loại dữ liệu trả về)
    // - Body: rỗng (''), có thể API không yêu cầu dữ liệu gửi kèm
    // - Nếu response không thành công (status khác 200-299) → ném lỗi
    // - Nếu thành công → trả về dữ liệu JSON (danh sách sản phẩm gợi ý)
    // - Có try/catch để xử lý lỗi và log ra console
    getRecommendedProducts: async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recommendation/cache`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*'
                },
                body: '' // gửi body rỗng
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json(); // Trả về dữ liệu JSON
        } catch (error) {
            console.error("Error fetching recommended products:", error);
            throw error; // Ném lỗi để phía gọi hàm xử lý
        }
    }
};
