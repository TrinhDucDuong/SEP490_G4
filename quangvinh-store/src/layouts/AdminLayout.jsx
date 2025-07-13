import { Outlet } from 'react-router-dom';

import SidebarForAdmin from '../components/layout/admin/SidebarForAdmin.jsx';

const AdminLayout = () => {

    return (
        <div className="flex min-h-screen">
            <div className="w-64">
                <SidebarForAdmin />
            </div>
            <div className="flex-1 flex flex-col min-w-0">

                <main className="flex-1 overflow-y-auto px-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
