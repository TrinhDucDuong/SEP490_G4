import { useEffect, useState } from 'react';
import { mapSingleOrder } from '../utils/orderMapper';

// Custom hook để lấy danh sách đơn hàng của user hiện tại
export const useFetchOrders = () => {
    // State lưu danh sách đơn hàng sau khi fetch thành công
    const [orders, setOrders] = useState([]);
    // State để kiểm soát trạng thái loading (true = đang tải dữ liệu)
    const [loading, setLoading] = useState(true);
    // State để lưu thông tin lỗi (nếu có lỗi khi gọi API)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Lấy token từ localStorage (token dùng để xác thực API)
        const token = localStorage.getItem('token');

        // Hàm bất đồng bộ để gọi API lấy danh sách đơn hàng
        const fetchOrders = async () => {
            try {
                // Gọi API backend `/order` với token trong headers
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/order`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Xác thực bằng JWT
                    },
                });

                // Nếu API trả lỗi (status != 200) thì ném exception
                if (!res.ok) throw new Error('Failed to fetch orders');

                // Parse JSON response từ API
                const data = await res.json();

                // Chuyển đổi dữ liệu raw từ API thành dữ liệu dùng trong FE
                // mapSingleOrder là hàm mapper cho từng đơn hàng
                const mappedOrders = (data.orders || []).map(mapSingleOrder);

                // Cập nhật state orders
                setOrders(mappedOrders);
            } catch (err) {
                // Nếu có lỗi thì log ra console và lưu vào state error
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra');
            } finally {
                // Dù thành công hay thất bại thì cũng tắt trạng thái loading
                setLoading(false);
            }
        };

        // Gọi hàm fetchOrders khi component mount lần đầu
        fetchOrders();
    }, []); // [] đảm bảo chỉ chạy 1 lần khi component mount

    // Trả về dữ liệu, trạng thái loading và error để component khác dùng
    return { orders, loading, error };
};
