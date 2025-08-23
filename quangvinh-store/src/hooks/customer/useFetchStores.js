import { useEffect, useState } from "react";
import { StoreAPI } from "../../utils/api/Customer/StoreAPI.js";

// Custom hook để fetch danh sách cửa hàng từ API
export const useFetchStores = () => {
    // State lưu danh sách cửa hàng sau khi fetch
    const [stores, setStores] = useState([]);
    // State kiểm soát trạng thái đang tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State lưu thông báo lỗi (nếu có lỗi xảy ra)
    const [error, setError] = useState(null);

    useEffect(() => {
        // Gọi API để lấy danh sách cửa hàng
        StoreAPI.fetchStores()
            .then((rawStores) => {
                // Nếu dữ liệu trả về không phải là mảng thì ném lỗi
                if (!Array.isArray(rawStores)) {
                    throw new Error("Dữ liệu trả về không đúng định dạng mảng.");
                }

                // Chuẩn hóa dữ liệu trả về thành format dễ sử dụng hơn trong UI
                const mappedStores = rawStores.map((store) => ({
                    id: store.storeId, // ID cửa hàng
                    name: store.storeName || "Chưa có tên", // Tên cửa hàng (mặc định nếu rỗng)
                    address: store.storeAddress || "Chưa có địa chỉ", // Địa chỉ cửa hàng
                    phone: store.storePhone || "Không có số điện thoại", // Số điện thoại cửa hàng
                    city: store.city || "Chưa rõ", // Thành phố
                    district: store.district || "Chưa rõ", // Quận/Huyện
                    openingHours: `${store.startWorkingAt || "??"} - ${store.endWorkingAt || "??"}`, // Giờ mở cửa
                    location: {
                        lat: parseFloat(store.locationLat) || 0, // Vĩ độ
                        lng: parseFloat(store.locationLng) || 0  // Kinh độ
                    },
                    // Cờ kiểm tra xem cửa hàng có tọa độ hợp lệ không
                    hasValidLocation: !isNaN(parseFloat(store.locationLat)) && !isNaN(parseFloat(store.locationLng))
                }));

                // Cập nhật state danh sách cửa hàng
                setStores(mappedStores);
            })
            .catch((err) => {
                // Nếu có lỗi khi gọi API => log ra console + lưu vào state error
                console.error("Lỗi khi fetch stores:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
        // Dù thành công hay thất bại thì cũng tắt trạng thái loading
    }, []);
    // [] => chỉ chạy 1 lần khi component mount

    // Trả dữ liệu và trạng thái cho component dùng
    return { stores, loading, error };
};
