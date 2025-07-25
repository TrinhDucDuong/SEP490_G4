import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetchRecommendation() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/recommendation`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setProducts(res.data.products || []);
            } catch (error) {
                console.error("Lỗi lấy đề xuất sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    return { products, loading };
}
