import React, { useState, useEffect } from 'react';
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
    ShoppingBag,
    Tag,
    Receipt,
    Store,
    Megaphone,
    ChevronDown,
    ChevronRight,
    Award
} from 'lucide-react';

const SidebarForStaff = () => {
    const location = useLocation();
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    // Auto open dropdown nếu đang ở trang categories hoặc product-types
    useEffect(() => {
        if (location.pathname === '/categories' || location.pathname === '/product-types') {
            setCategoryDropdownOpen(true);
        }
    }, [location.pathname]);

    // Hàm toggle dropdown - chỉ thay đổi khi click vào button chính
    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCategoryDropdownOpen(!categoryDropdownOpen);
    };

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-lg overflow-y-auto z-40">
            {/* Navigation Menu */}
            <nav className="p-4 space-y-2">
                {/* Quản lý sản phẩm */}
                <NavLink
                    to="/products-management"
                    to="/products-management"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <Package className="h-5 w-5 mr-3" />
                    Quản lý sản phẩm
                </NavLink>

                {/* Danh mục sản phẩm - Dropdown - FIX ALIGNMENT */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-left ${
                            (location.pathname === '/categories' || location.pathname === '/product-types')
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center">
                            <Tag className="h-5 w-5 mr-3 flex-shrink-0" />
                            <span>Danh mục sản phẩm</span>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                            {categoryDropdownOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </div>
                    </button>

                    {/* Dropdown Menu - FIX INDENTATION */}
                    {categoryDropdownOpen && (
                        <div className="mt-1 space-y-1">
                            <NavLink
                                to="/categories"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 ml-4 text-sm rounded-md transition-all duration-200 ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                <span>Danh mục</span>
                            </NavLink>
                            <NavLink
                                to="/product-types"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 ml-4 text-sm rounded-md transition-all duration-200 ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                <span>Loại trang phục</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Quản lý thương hiệu */}
                <NavLink
                    to="/brands"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <Award className="h-5 w-5 mr-3" />
                    Quản lý thương hiệu
                </NavLink>

                {/* Khách hàng */}
                <NavLink
                    to="/customers"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <Users className="h-5 w-5 mr-3" />
                    Khách hàng
                </NavLink>

                {/* Hóa đơn */}
                <NavLink
                    to="/invoices"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <Receipt className="h-5 w-5 mr-3" />
                    Hóa đơn
                </NavLink>

                {/* Feedback */}
                <NavLink
                    to="/feedback"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    Feedback
                </NavLink>

                {/* Chính sách */}
                <NavLink
                    to="/policies"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <FileText className="h-5 w-5 mr-3" />
                    Chính sách
                </NavLink>

                {/* Hướng dẫn */}
                <NavLink
                    to="/guides"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <FileText className="h-5 w-5 mr-3" />
                    Hướng dẫn
                </NavLink>

                {/* Thống kê */}
                <NavLink
                    to="/statistics"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <BarChart3 className="h-5 w-5 mr-3" />
                    Thống kê
                </NavLink>

                {/* Nhân viên */}
                <NavLink
                    to="/staff"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <UserPlus className="h-5 w-5 mr-3" />
                    Nhân viên
                </NavLink>

                {/* Quản lý cửa hàng */}
                <NavLink
                    to="/store-management"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <Store className="h-5 w-5 mr-3" />
                    Quản lý cửa hàng
                </NavLink>

                {/* Quản lý chiến dịch */}
                <NavLink
                    to="/campaigns"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <Megaphone className="h-5 w-5 mr-3" />
                    Quản lý chiến dịch
                </NavLink>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Settings */}
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'bg-gray-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <Settings className="h-5 w-5 mr-3" />
                    Cài đặt
                </NavLink>

                {/* Logout */}
                <button
                    onClick={() => {
                        // Handle logout logic
                        console.log('Logout clicked');
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Đăng xuất
                </button>
            </nav>
        </div>
    );
};

export default SidebarForStaff;
