import { useEffect, useState } from "react";
import axios from "axios";

// Custom hook để gọi API lấy danh sách sản phẩm gợi ý cho user
export default function useFetchRecommendation() {
    // State lưu danh sách sản phẩm được gợi ý
    const [products, setProducts] = useState([]);
    // State theo dõi trạng thái loading (true = đang tải dữ liệu)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hàm bất đồng bộ gọi API recommendation
        const fetchRecommendations = async () => {
            try {
                // Gọi API bằng axios, gửi kèm token để xác thực
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/recommendation`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}` // Lấy token từ localStorage
                        }
                    }
                );

                // Lưu danh sách sản phẩm vào state (nếu không có thì trả mảng rỗng)
                setProducts(res.data.products || []);
            } catch (error) {
                // Nếu có lỗi thì in ra console để debug
                console.error("Lỗi lấy đề xuất sản phẩm:", error);
            } finally {
                // Sau khi fetch xong (thành công hoặc thất bại) thì tắt loading
                setLoading(false);
            }
        };

        // Gọi API ngay khi component mount
        fetchRecommendations();
    }, []); // [] để đảm bảo chỉ gọi 1 lần khi component được render lần đầu

    // Trả về danh sách sản phẩm và trạng thái loading để component khác dùng
    return { products, loading };
}
