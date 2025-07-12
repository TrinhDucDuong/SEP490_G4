import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuthForManager } from '../../../context/AuthContextForManager';

const HeaderForManager = ({ setSidebarOpen, sidebarOpen }) => {
    const { user } = useAuthForManager();

    return (
        <header className="top-0 left-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50">
            <div className="flex items-center justify-between h-full px-6">
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen?.(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="ml-4 text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap">
                        Quang Vinh Authentic – Admin
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none">
                        <Bell className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                            {user?.username || 'Admin'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderForManager;
