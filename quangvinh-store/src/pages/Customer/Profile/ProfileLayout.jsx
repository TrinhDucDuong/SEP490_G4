import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";
import SidebarProfile from "./Information/SidebarProfile.jsx";

function ProfileLayout() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const breadcrumbItems = [
        { label: "Trang chủ", to: "/" },
        { label: "Tài Khoản", to: "/profile" },
    ];

    return (
        <div className="min-h-screen px-4 py-6 md:px-12 lg:px-20 bg-gradient-to-br">
            <div className="max-w-7xl mx-auto space-y-6">
                <Breadcrumb items={breadcrumbItems} />
                <div className="flex flex-col lg:flex-row">
                    <SidebarProfile />
                    <div className="flex-1 bg-white/90 backdrop-blur-sm">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileLayout;
