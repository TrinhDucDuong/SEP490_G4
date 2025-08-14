import { Outlet } from 'react-router-dom';

import SidebarForStaff from '../components/layout/staff/SidebarForStaff.jsx';

const ManagerLayout = () => {

    return (
        <div className="flex min-h-screen">
            <div className="w-64">
                <SidebarForStaff />
            </div>
            <div className="flex-1 flex flex-col min-w-0">

                <main className="flex-1 overflow-y-auto px-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ManagerLayout;
