import { useEffect, useState } from 'react';
import { mapSingleOrder } from '../utils/orderMapper';
import { fetchOrderById } from "../../../utils/api/Customer/OrderAPI.js";

// Custom hook để fetch chi tiết đơn hàng theo orderId
export const useFetchOrderById = (orderId) => {
    // State lưu thông tin đơn hàng sau khi fetch thành công
    const [order, setOrder] = useState(null);
    // State để kiểm soát trạng thái loading (đang fetch dữ liệu)
    const [loading, setLoading] = useState(true);
    // State để lưu lỗi nếu có
    const [error, setError] = useState(null);

    useEffect(() => {
        // Lấy token từ localStorage (dùng cho Authorization)
        const token = localStorage.getItem('token');

        // Hàm bất đồng bộ để fetch dữ liệu đơn hàng
        const fetchData = async () => {
            try {
                // Gọi API lấy chi tiết đơn hàng theo orderId và token
                const data = await fetchOrderById(token, orderId);

                // Dùng mapSingleOrder để chuyển đổi dữ liệu API -> dữ liệu hiển thị
                setOrder(mapSingleOrder(data.order));
            } catch (err) {
                // Nếu lỗi thì lưu message vào state error
                setError(err.message || 'Lỗi khi lấy đơn hàng');
            } finally {
                // Dù thành công hay thất bại thì cũng tắt trạng thái loading
                setLoading(false);
            }
        };

        // Gọi hàm fetch ngay khi hook được mount hoặc khi orderId thay đổi
        fetchData();
    }, [orderId]); // useEffect phụ thuộc vào orderId, khi orderId đổi sẽ fetch lại

    // Trả ra 3 state để component sử dụng
    return { order, loading, error };
};
