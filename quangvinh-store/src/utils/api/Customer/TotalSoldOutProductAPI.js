// Hàm lấy danh sách sản phẩm (sắp xếp theo số lượng bán ra nhiều nhất - totalSoldOut)
// - Không cần truyền tham số
// - Gửi request GET đến endpoint /product?sortDirection=desc&sortBy=totalSoldOut&pageNumber=0&pageSize=10
//   + sortDirection=desc  → sắp xếp giảm dần
//   + sortBy=totalSoldOut → sắp xếp theo số lượng bán ra
//   + pageNumber=0        → lấy trang đầu tiên
//   + pageSize=30         → giới hạn 30 sản phẩm
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch products"
// - Nếu thành công, parse JSON và trả về mảng data.products
export const fetchProducts = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/product?sortDirection=desc&sortBy=totalSoldOut&pageNumber=0&pageSize=30`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products;
};
