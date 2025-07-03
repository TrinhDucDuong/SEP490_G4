import { Outlet } from 'react-router-dom';
import HeaderForManager from "../components/layout/admin/HeaderForManager.jsx";
import SidebarForStaff from "../components/layout/admin/SidebarForStaff.jsx";


const AdminLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderForManager />
            <div className="flex flex-grow">
                <SidebarForStaff />
                <main className="flex-grow p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
