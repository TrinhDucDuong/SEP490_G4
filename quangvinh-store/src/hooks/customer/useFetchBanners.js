import { useEffect, useState } from "react";
import { fetchBanner } from "../../utils/api/Customer/BannerAPI.js";

// Custom hook để lấy danh sách banner từ API
export const useFetchBanners = () => {
    // State lưu danh sách banner
    const [banners, setBanners] = useState([]);
    // State theo dõi trạng thái đang tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State lưu lỗi nếu gọi API thất bại
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm async để gọi API lấy banner
        const loadBanners = async () => {
            try {
                const data = await fetchBanner();
                // Nếu API trả về có trường bannerImages thì lấy, nếu không thì gán mảng rỗng
                setBanners(data.bannerImages || []);
            } catch (err) {
                // Nếu có lỗi thì lưu thông tin lỗi
                setError(err.message || "Không thể tải banner.");
            } finally {
                // Dù thành công hay lỗi cũng tắt trạng thái loading
                setLoading(false);
            }
        };

        // Gọi hàm loadBanners ngay khi component mount
        loadBanners();
    }, []); // [] nghĩa là chỉ chạy 1 lần khi component render lần đầu

    // Trả về dữ liệu banner, trạng thái loading và error cho component sử dụng
    return { banners, loading, error };
};
