import React from 'react';
import { Bell, User } from 'lucide-react';

const HeaderForManager = ({ username = "Ngô Quang Thắng", role = "Admin" }) => {
    const handleNotificationClick = () => {
        // Chức năng notification sẽ làm sau
        console.log('Notification clicked');
    };

    return (
        <header className="w-full bg-white border-b border-gray-100 h-16 flex items-center px-4 lg:px-8 z-30">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 h-full">
                <div className="text-xl font-bold text-gray-900">
                    Quang Vinh Authentic
                </div>
            </div>

            {/* Giữa header để trống */}
            <div className="flex-1"></div>

            {/* Notification + User info */}
            <div className="flex items-center space-x-6">
                {/* Notification icon */}
                <button
                    onClick={handleNotificationClick}
                    className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none transition"
                    aria-label="Notification"
                >
                    <Bell className="h-6 w-6 text-gray-700" />
                    {/* Badge notification nếu cần sau này */}
                    {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
                </button>

                {/* User info */}
                <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                        <span className="font-semibold text-gray-900 text-sm leading-none">{username}</span>
                        <span className="text-xs text-gray-500">{role}</span>
                    </div>
                    <div className="ml-2">
                        <User className="h-7 w-7 text-gray-700" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderForManager;
