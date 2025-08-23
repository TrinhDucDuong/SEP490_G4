import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getAddresses } from "../../utils/api/Customer/AddressAPI.js";

// Custom hook để lấy danh sách địa chỉ của khách hàng
const useFetchAddress = () => {
    // Lấy token từ AuthContext (dùng cho xác thực API)
    const { token } = useContext(AuthContext);

    // State quản lý dữ liệu
    const [addresses, setAddresses] = useState([]); // danh sách địa chỉ
    const [loading, setLoading] = useState(true);   // trạng thái đang tải
    const [error, setError] = useState(null);       // thông tin lỗi (nếu có)

    // Hàm gọi API để lấy danh sách địa chỉ
    const fetchAddresses = async () => {
        if (!token) return; // Nếu chưa đăng nhập (chưa có token) thì không gọi API
        setLoading(true);
        try {
            const data = await getAddresses(token); // Gọi API lấy địa chỉ
            setAddresses(data);                     // Lưu kết quả vào state
            setError(null);                         // Reset lỗi nếu thành công
        } catch (err) {
            setError(err);                          // Nếu có lỗi thì lưu lại
        } finally {
            setLoading(false);                      // Tắt trạng thái loading
        }
    };

    // Tự động gọi API khi component mount hoặc khi token thay đổi
    useEffect(() => {
        fetchAddresses();
    }, [token]);

    // Trả ra data + trạng thái + hàm refetch để component có thể gọi lại API khi cần
    return { addresses, loading, error, refetch: fetchAddresses };
};

export default useFetchAddress;
