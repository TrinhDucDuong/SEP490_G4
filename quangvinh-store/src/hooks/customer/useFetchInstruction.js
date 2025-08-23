import { useEffect, useState } from 'react';
import { fetchInstructions } from '../../utils/api/Customer/InstructionAPI.js';

export const useFetchInstruction = () => {
    // State lưu danh sách hướng dẫn
    const [instructions, setInstructions] = useState([]);
    // State quản lý trạng thái đang tải
    const [loading, setLoading] = useState(true);
    // State lưu lỗi nếu có
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm gọi API lấy danh sách hướng dẫn
        const fetchData = async () => {
            try {
                const data = await fetchInstructions();
                // Nếu API trả về danh sách thì set vào state, ngược lại để mảng rỗng
                setInstructions(data.instructions || []);
            } catch (err) {
                // Nếu lỗi thì lưu message lỗi
                setError(err.message);
            } finally {
                // Dù thành công hay thất bại thì cũng tắt trạng thái loading
                setLoading(false);
            }
        };
        fetchData(); // Gọi API ngay khi component được mount
    }, []);

    // Trả ra dữ liệu để component khác sử dụng
    return { instructions, loading, error };
};
