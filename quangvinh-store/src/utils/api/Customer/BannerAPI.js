/**
 * ============================================================
 * @file fetchBanner.js
 * @description Hàm gọi API để lấy dữ liệu banner từ backend.
 *
 * @copyright (c) 2025
 * @author:
 *   - ngothangwork
 * ============================================================
 */

/**
 * Thư viện sử dụng:
 * - fetch (built-in trong trình duyệt / Node.js môi trường hiện đại)
 * - import.meta.env (cơ chế của Vite để lấy biến môi trường)
 */

/**
 * Hàm fetchBanner
 * ----------------
 * Mục đích:
 *   - Gửi HTTP GET request tới API backend để lấy dữ liệu banner.
 *   - Trả về dữ liệu JSON chứa thông tin banner.
 *
 * Cách hoạt động:
 *   1. Tạo request tới `${VITE_API_BASE_URL}/banner` bằng fetch.
 *   2. Kiểm tra response:
 *      - Nếu response không thành công (status != 200–299), ném lỗi.
 *   3. Nếu thành công, parse JSON và return.
 *
 * @returns {Promise<Object>} Dữ liệu banner từ backend (định dạng JSON).
 * @throws {Error} Nếu không thể fetch dữ liệu banner.
 */
export const fetchBanner = async () => {
    // Gửi request GET đến API banner
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/banner`);

    // Nếu request thất bại thì ném lỗi
    if (!response.ok) {
        throw new Error('Failed to fetch banner');
    }

    // Trả về dữ liệu JSON
    return await response.json();
};
