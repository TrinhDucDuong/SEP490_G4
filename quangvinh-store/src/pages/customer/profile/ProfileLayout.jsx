/**
 * @file ProfileLayout.jsx
 * @description Layout chính cho trang "Tài khoản" của khách hàng, bao gồm Sidebar và nội dung động.
 * @author
 *   - ngothangwork
 * @license MIT
 */

import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Breadcrumb from "../../../components/common/customer/Breadcrumb.jsx";
import SidebarProfile from "./information/SidebarProfile.jsx";

/**
 * ProfileLayout Component
 *
 * 👉 Chức năng:
 * - Hiển thị bố cục trang tài khoản (My Account).
 * - Bao gồm Breadcrumb, Sidebar (menu tài khoản), và khu vực nội dung chính (render qua <Outlet />).
 * - Tự động scroll lên đầu trang khi thay đổi route trong trang profile.
 */
function ProfileLayout() {
    const location = useLocation();

    /**
     * useEffect: Khi thay đổi đường dẫn (pathname),
     * thì tự động scroll về đầu trang để trải nghiệm mượt mà hơn.
     */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Danh sách breadcrumb hiển thị trên đầu trang
    const breadcrumbItems = [
        { label: "Trang chủ", to: "/" },
        { label: "Tài Khoản", to: "/profile" },
    ];

    return (
        <div className="min-h-screen px-4 py-6 md:px-12 lg:px-20 bg-gradient-to-br">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Breadcrumb điều hướng */}
                <Breadcrumb items={breadcrumbItems} />

                <div className="flex flex-col lg:flex-row">
                    {/* Sidebar hiển thị menu tài khoản */}
                    <SidebarProfile />

                    {/* Nội dung chính, render theo route con */}
                    <div className="flex-1 bg-white/90 backdrop-blur-sm">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileLayout;
