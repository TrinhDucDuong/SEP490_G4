/**
 * @file NotFound.jsx
 * @description Component hiển thị trang 404 khi người dùng truy cập vào đường dẫn không tồn tại.
 * Bao gồm:
 * - Mã lỗi 404
 * - Thông báo không tìm thấy trang
 * - Nút quay về trang chủ
 * @author ngothangwork
 * @copyright 2025 ngothangwork
 */

import { Link } from "react-router-dom";

/**
 * Component NotFound
 *
 * @component
 * @example
 * return (
 *   <NotFound />
 * )
 */
function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
            <h1 className="text-6xl font-bold text-black mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-6">Không tìm thấy trang bạn yêu cầu.</p>
            <Link
                to="/"
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
            >
                Quay về trang chủ
            </Link>
        </div>
    );
}

export default NotFound;