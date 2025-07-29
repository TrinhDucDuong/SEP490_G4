import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faKey, faLock, faMapMarkerAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

function SidebarProfile() {
    const location = useLocation();

    return (
        <aside className="lg:w-80 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-xl" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Tài khoản của tôi</span>
            </div>
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

function SidebarItem({ icon, label, to, currentPath }) {
    const isActive = currentPath === to;

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