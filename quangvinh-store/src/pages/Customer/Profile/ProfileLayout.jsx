import { Outlet } from "react-router-dom";
import Breadcrumb from "../../../components/common/Breadcrumb.jsx";
import SidebarProfile from "../Common/SidebarProfile.jsx";

function ProfileLayout() {
    const breadcrumbItems = [
        { label: "Trang chủ", to: "/" },
        { label: "Tài Khoản", to: "/profile" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-20">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-10 flex flex-col lg:flex-row gap-8">
                <SidebarProfile />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ProfileLayout;
