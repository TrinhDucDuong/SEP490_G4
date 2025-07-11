import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderForManager from "../components/layout/admin/HeaderForManager.jsx";
import SidebarForAdmin from "../components/layout/admin/SidebarForAdmin.jsx";


const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
            <HeaderForManager />
            <SidebarForAdmin />
            <main className="ml-64 pt-20"> {/* Tăng pt-16 thành pt-20 để tránh overlap */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
