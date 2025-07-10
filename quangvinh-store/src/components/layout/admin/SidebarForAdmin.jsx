import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Package,
    FileText,
    Users,
    MessageSquare,
    BarChart3,
    UserPlus,
    Settings,
    LogOut,
    Tag,
    Receipt,
    Store,
    Megaphone,
    Award,
    User
} from 'lucide-react';
import { useAuthForManager } from '../../../context/AuthContextForManager';
import { useNavigate } from 'react-router-dom';
import Modal from '../../common/Modals';

const SidebarForAdmin = () => {
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { logout, user } = useAuthForManager();
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('Logging out...');
        logout();
        setShowLogoutModal(false);
    };

    return (
        <>
            <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-lg overflow-y-auto z-40">
                {/* User Info Section */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-sm">
                                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">
                                {user?.username || 'Admin'}
                            </div>
                            <div className="text-xs text-gray-600">
                                {user?.email || 'admin@example.com'}
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    <NavLink to="/admin/products-management" className={navClass}>
                        <Package className="h-5 w-5 mr-3" />
                        Quản lý sản phẩm
                    </NavLink>

                    <NavLink to="/admin/category-management" className={navClass}>
                        <Tag className="h-5 w-5 mr-3" />
                        Danh mục sản phẩm
                    </NavLink>

                    <NavLink to="/admin/brands-management" className={navClass}>
                        <Award className="h-5 w-5 mr-3" />
                        Quản lý thương hiệu
                    </NavLink>

                    <NavLink to="/admin/customers-management" className={navClass}>
                        <Users className="h-5 w-5 mr-3" />
                        Khách hàng
                    </NavLink>

                    <NavLink to="/admin/orders-management" className={navClass}>
                        <Receipt className="h-5 w-5 mr-3" />
                        Hóa đơn
                    </NavLink>

                    <NavLink to="/admin/feedbacks" className={navClass}>
                        <MessageSquare className="h-5 w-5 mr-3" />
                        Feedback
                    </NavLink>

                    <NavLink to="/admin/policies-management" className={navClass}>
                        <FileText className="h-5 w-5 mr-3" />
                        Chính sách
                    </NavLink>

                    <NavLink to="/admin/instruction-management" className={navClass}>
                        <FileText className="h-5 w-5 mr-3" />
                        Hướng dẫn
                    </NavLink>

                    <NavLink to="/admin/statistics" className={navClass}>
                        <BarChart3 className="h-5 w-5 mr-3" />
                        Thống kê
                    </NavLink>

                    <NavLink to="/admin/employee-management" className={navClass}>
                        <UserPlus className="h-5 w-5 mr-3" />
                        Nhân viên
                    </NavLink>

                    <NavLink to="/admin/store-management" className={navClass}>
                        <Store className="h-5 w-5 mr-3" />
                        Quản lý cửa hàng
                    </NavLink>

                    <NavLink to="/admin/campaign-management" className={navClass}>
                        <Megaphone className="h-5 w-5 mr-3" />
                        Quản lý chiến dịch
                    </NavLink>

                    <div className="border-t border-gray-200 my-4"></div>

                    <NavLink to="/admin/settings-management" className={navClass}>
                        <Settings className="h-5 w-5 mr-3" />
                        Cài đặt
                    </NavLink>

                    {/* Enhanced Logout Button */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-md border border-transparent hover:border-red-200 group"
                    >
                        <LogOut className="h-5 w-5 mr-3 group-hover:animate-pulse" />
                        Đăng xuất
                    </button>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                        © 2024 Quang Vinh Authentic
                    </p>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
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
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"s
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

// Reusable className generators
const navClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
            : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 hover:shadow-sm'
    }`;

export default SidebarForAdmin;
