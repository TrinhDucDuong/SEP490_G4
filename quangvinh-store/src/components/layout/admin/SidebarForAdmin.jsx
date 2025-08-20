import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Package, FileText, Users, MessageSquare, BarChart3, UserPlus, Settings, LogOut, Tag, Receipt, Store, Megaphone, Award } from 'lucide-react';
import { useAuthForManager } from '../../../context/AuthContextForManager';
import Modal from '../../common/admin/Modals.jsx';

const SidebarForAdmin = () => {
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { logout, user, isAdmin, userRoles } = useAuthForManager();
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Logging out...');
        logout();
        setShowLogoutModal(false);
    };

    const menuItems = [
        // Admin
        {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: BarChart3,
            roles: ['ADMINISTRATOR']
        },
        // Common items - Both Admin & Staff
        {
            path: '/staff/products-management',
            label: 'Quản lý sản phẩm',
            icon: Package,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        {
            path: '/staff/category-management',
            label: 'Quản lý danh mục',
            icon: Tag,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        {
            path: '/staff/brands-management',
            label: 'Quản lý thương hiệu',
            icon: Award,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        {
            path: '/staff/orders-management',
            label: 'Quản lý đơn hàng',
            icon: Receipt,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        {
            path: '/staff/banner-management',
            label: 'Quản lý banner',
            icon: Megaphone,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        {
            path: '/staff/star-rate-management',
            label: 'Quản lý đánh giá',
            icon: MessageSquare,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        {
            path: '/staff/instruction-management',
            label: 'Quản lý hướng dẫn',
            icon: FileText,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        {
            path: '/staff/policies-management',
            label: 'Quản lý chính sách',
            icon: Settings,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        {
            path: '/staff/blogs',
            label: 'Quản lý blog',
            icon: FileText,
            roles: ['ADMINISTRATOR', 'STAFF']
        },
        // Admin only items
        {
            path: '/admin/customers-management',
            label: 'Quản lý khách hàng',
            icon: Users,
            roles: ['ADMINISTRATOR']
        },
        {
            path: '/admin/employee-management',
            label: 'Quản lý nhân viên',
            icon: UserPlus,
            roles: ['ADMINISTRATOR']
        },
        {
            path: '/admin/store-management',
            label: 'Quản lý cửa hàng',
            icon: Store,
            roles: ['ADMINISTRATOR']
        },
        {
            path: '/admin/sns-management',
            label: 'Quản lý mạng xã hội',
            icon: MessageSquare,
            roles: ['ADMINISTRATOR']
        }
    ];

    const filteredMenuItems = menuItems.filter(item => {
        if (isAdmin()) return true;
        return item.roles.includes('STAFF');
    });

    return (
        <>
            <div className="bg-white h-full shadow-lg border-r border-gray-200 flex flex-col">

                {/* User info */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                                {user?.username?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.username}
                            </p>
                            <p className="text-xs text-gray-500">
                                {userRoles.includes('ADMINISTRATOR') ? 'Administrator' : 'Staff'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Đăng xuất
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">© 2025 Quang Vinh Authentic</p>
                    </div>
                </div>
            </div>

            {/* Logout Modal */}
            <Modal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title="Xác nhận đăng xuất"
                size="sm"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <LogOut className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Đăng xuất khỏi hệ thống
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Bạn có chắc chắn muốn đăng xuất khỏi tài khoản <strong>{user?.username}</strong> không?
                    </p>
                    <div className="flex justify-center space-x-3">
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SidebarForAdmin;
