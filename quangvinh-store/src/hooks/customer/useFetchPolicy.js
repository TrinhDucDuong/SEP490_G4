import { useEffect, useState } from 'react';
import {fetchPolicies} from "../../utils/api/Customer/PolicyAPI.js";

export const useFetchPolicy = () => {
    // State lưu danh sách chính sách (policies)
    const [policies, setPolicies] = useState([]);
    // State quản lý trạng thái loading
    const [loading, setLoading] = useState(true);
    // State lưu lỗi nếu có
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm gọi API để lấy dữ liệu chính sách
        const fetchData = async () => {
            try {
                // Gọi API lấy dữ liệu từ backend
                const data = await fetchPolicies();

                // Nếu có dữ liệu thì lưu vào state, nếu không thì set rỗng
                setPolicies(data.policies || []);
            } catch (err) {
                // Nếu lỗi, lưu message lỗi
                setError(err.message);
            } finally {
                // Sau khi xong (thành công hoặc thất bại) đều tắt loading
                setLoading(false);
            }
        };

        // Gọi API khi component mount
        fetchData();
    }, []);

    // Trả dữ liệu và trạng thái ra cho component khác dùng
    return { policies, loading, error };
};
