/**
 * SidebarProfile.jsx
 *
 * Copyright (c) 2025 by ngothangwork
 * Author: ngothangwork
 *
 * Mô tả: Component SidebarProfile hiển thị thanh sidebar cho trang hồ sơ người dùng,
 * chứa các mục điều hướng như Hồ sơ, Địa chỉ, Đơn hàng, Đổi mật khẩu, Thông báo, và Riêng tư.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import thư viện icon FontAwesome
import {
    faBell,
    faKey,
    faLock,
    faMapMarkerAlt,
    faUser
} from "@fortawesome/free-solid-svg-icons"; // Import các icon cần dùng
import { Link, useLocation } from "react-router-dom"; // Import Link và useLocation để điều hướng & lấy URL hiện tại

/**
 * Component SidebarProfile
 * - Hiển thị thông tin tài khoản và danh sách điều hướng profile
 */
function SidebarProfile() {
    const location = useLocation(); // Hook lấy pathname hiện tại để xác định mục nào đang active

    return (
        <aside className="lg:w-80 p-6">
            {/* Header: avatar + tiêu đề "Tài khoản của tôi" */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-xl" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Tài khoản của tôi</span>
            </div>

            {/* Navigation: danh sách các link điều hướng */}
            <nav className="flex flex-col gap-2">
                <SidebarItem
                    icon={faUser}
                    label="Hồ sơ"
                    to="/profile"
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={faMapMarkerAlt}
                    label="Địa chỉ"
                    to="/profile/address"
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={faMapMarkerAlt}
                    label="Đơn hàng"
                    to="/profile/order-history"
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={faKey}
                    label="Đổi mật khẩu"
                    to="/profile/change-password"
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={faBell}
                    label="Thông báo"
                    to="/profile/notifications"
                    currentPath={location.pathname}
                />
                <SidebarItem
                    icon={faLock}
                    label="Riêng tư"
                    to="/profile/privacy"
                    currentPath={location.pathname}
                />
            </nav>
        </aside>
    );
}

/**
 * Component SidebarItem
 * @param {icon} icon - Icon hiển thị bên trái
 * @param {label} label - Tên menu
 * @param {to} to - Đường dẫn điều hướng
 * @param {currentPath} currentPath - URL hiện tại để so sánh active
 *
 * - Trả về 1 item trong sidebar với trạng thái active (nổi bật) nếu URL khớp.
 */
function SidebarItem({ icon, label, to, currentPath }) {
    const isActive = currentPath === to; // Kiểm tra có phải trang hiện tại không

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 ${
                isActive ? "bg-gray-100 text-gray-900 font-semibold" : ""
            }`}
        >
            <FontAwesomeIcon icon={icon} className="text-base" />
            <span>{label}</span>
        </Link>
    );
}

export default SidebarProfile;
