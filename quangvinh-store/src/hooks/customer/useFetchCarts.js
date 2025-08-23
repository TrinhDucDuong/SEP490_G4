import { useEffect, useState } from 'react';
import { fetchCartAPI } from "../../utils/api/Customer/CartAPI.js";

// Custom hook để lấy giỏ hàng theo accountId
const useFetchCarts = (accountId) => {
    // State lưu danh sách sản phẩm trong giỏ hàng
    const [cartItems, setCartItems] = useState([]);
    // State quản lý trạng thái loading
    const [loading, setLoading] = useState(true);
    // State lưu lỗi (nếu có)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Nếu chưa có accountId thì không fetch
        if (!accountId) return;

        const fetchData = async () => {
            setLoading(true); // Bắt đầu loading
            try {
                // Gọi API lấy giỏ hàng theo accountId
                const data = await fetchCartAPI(accountId);

                // Format lại dữ liệu giỏ hàng để dễ dùng trong UI
                const formatted = data.cart.map((item) => ({
                    id: item.cartDetailsId, // id chi tiết giỏ hàng
                    productName: item.productVariant.product.productName, // tên sản phẩm
                    productImage: item.productVariant.product.images?.[0]?.imageUrl || '/placeholder.png', // ảnh sản phẩm (hoặc ảnh mặc định)
                    colorHexCode: item.productVariant.color.colorHex, // màu sắc
                    sizeCode: item.productVariant.productSize, // kích thước
                    quantity: item.quantity, // số lượng
                    price: item.productVariant.product.unitPrice, // giá tiền
                }));

                // Lưu dữ liệu format vào state
                setCartItems(formatted);
            } catch (err) {
                // Nếu có lỗi, gán vào state error
                setError(err);
            } finally {
                // Dù thành công hay thất bại thì cũng tắt loading
                setLoading(false);
            }
        };

        // Gọi hàm fetchData khi accountId thay đổi
        fetchData();
    }, [accountId]); // Mỗi lần accountId thay đổi thì fetch lại

    // Trả ra cartItems, loading, error và setCartItems để component có thể thao tác
    return { cartItems, loading, error, setCartItems };
};

export default useFetchCarts;
