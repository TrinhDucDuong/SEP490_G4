// Hàm lấy danh sách sản phẩm (có phân trang & sắp xếp)
// - Không cần truyền tham số (mặc định sort theo createdAt giảm dần, lấy 20 sản phẩm đầu tiên)
// - Gửi request GET đến endpoint /product?sortDirection=desc&sortBy=createdAt&pageNumber=0&pageSize=20
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch products"
// - Nếu thành công, trả về mảng sản phẩm (data.products) hoặc [] nếu không có sản phẩm
export const fetchProducts = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/product?sortDirection=desc&sortBy=createdAt&pageNumber=0&pageSize=20`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products || [];
};

// Hàm lấy chi tiết một sản phẩm theo id
// - Tham số: id (id của sản phẩm cần lấy)
// - Gửi request GET đến endpoint /product/{id}
// - Nếu request thất bại (response không ok), ném ra lỗi "Failed to fetch product"
// - Nếu thành công, trả về đối tượng sản phẩm (data.product)
export const fetchProductById = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    const data = await response.json();
    return data.product;
};
