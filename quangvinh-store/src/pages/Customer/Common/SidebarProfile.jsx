import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faKey, faLock, faMapMarkerAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

function SidebarProfile() {
    const location = useLocation();

    return (
        <aside className="lg:w-1/4 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="text-xl" />
                </div>
                <span className="font-semibold text-lg">Tài khoản của tôi</span>
            </div>
            <nav className="flex flex-col gap-3 text-gray-700 font-medium">
                <SidebarItem icon={faUser} label="Hồ sơ" to="/profile" currentPath={location.pathname} />
                <SidebarItem icon={faMapMarkerAlt} label="Địa chỉ" to="/profile/address" currentPath={location.pathname} />
                <SidebarItem icon={faKey} label="Đổi mật khẩu" to="/profile/change-password" currentPath={location.pathname} />
                <SidebarItem icon={faBell} label="Thông báo" to="/profile/notifications" currentPath={location.pathname} />
                <SidebarItem icon={faLock} label="Riêng tư" to="/profile/privacy" currentPath={location.pathname} />
            </nav>
        </aside>
    );
}

export default SidebarProfile;

function SidebarItem({ icon, label, to, currentPath }) {
    const isActive = currentPath === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-semibold" : ""
            }`}
        >
            <FontAwesomeIcon icon={icon} />
            <span>{label}</span>
        </Link>
    );
}
