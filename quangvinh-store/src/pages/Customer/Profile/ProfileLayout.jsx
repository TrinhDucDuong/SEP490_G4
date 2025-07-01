import { Outlet } from "react-router-dom";
import Breadcrumb from "../../../components/common/Breadcrumb.jsx";
import SidebarProfile from "../Common/SidebarProfile.jsx";

function ProfileLayout() {

    const breadcrumbItems = [
        { label: "Trang chủ", to: "/" },
        { label: "Tài Khoản", to: "/profile" },
    ];

    return (
        <div className="min-h-screen px-4 py-6 md:px-12 lg:px-20 bg-gradient-to-br from-black via-green-300 to-yellow-200">
            <div className="max-w-7xl mx-auto space-y-6">
                <Breadcrumb items={breadcrumbItems} />
                <div className="flex flex-col lg:flex-row gap-6">
                    <SidebarProfile />
                    <div className="flex-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-6 lg:p-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileLayout;
