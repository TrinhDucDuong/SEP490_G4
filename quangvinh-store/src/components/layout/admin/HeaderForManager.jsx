import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuthForManager } from '../../../context/AuthContextForManager';

const HeaderForManager = ({ setSidebarOpen, sidebarOpen }) => {
    const { user } = useAuthForManager();

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left side - Menu button */}
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="ml-4 text-xl font-semibold text-gray-900">
                        Quang Vinh Authentic - Admin
                    </h1>
                </div>

                {/* Right side - User info */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                        <Bell className="h-6 w-6" />
                    </button>

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {user?.username || 'Admin'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderForManager;
