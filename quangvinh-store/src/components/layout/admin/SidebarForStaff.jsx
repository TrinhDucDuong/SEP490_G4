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

    useEffect(() => {
        if (
            location.pathname === '/admin/categories' ||
            location.pathname === '/admin/product-types'
        ) {
            setCategoryDropdownOpen(true);
        }
    }, [location.pathname]);

    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCategoryDropdownOpen(!categoryDropdownOpen);
    };

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-lg overflow-y-auto z-40">
            <nav className="p-4 space-y-2">
                <NavLink to="/admin/products-management" className={navClass}>
                    <Package className="h-5 w-5 mr-3" />
                    Quản lý sản phẩm
                </NavLink>

                {/* Danh mục sản phẩm - Dropdown */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-left ${
                            location.pathname.startsWith('/admin/categories') ||
                            location.pathname.startsWith('/admin/product-types')
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

                    {categoryDropdownOpen && (
                        <div className="mt-1 space-y-1">
                            <NavLink to="/admin/categories" className={subNavClass}>
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                <span>Danh mục</span>
                            </NavLink>
                            <NavLink to="/admin/product-types" className={subNavClass}>
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                <span>Loại trang phục</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink to="/admin/brands" className={navClass}>
                    <Award className="h-5 w-5 mr-3" />
                    Quản lý thương hiệu
                </NavLink>

                <NavLink to="/admin/customers" className={navClass}>
                    <Users className="h-5 w-5 mr-3" />
                    Khách hàng
                </NavLink>

                <NavLink to="/admin/orders" className={navClass}>
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

                <button
                    onClick={() => console.log('Logout clicked')}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Đăng xuất
                </button>
            </nav>
        </div>
    );
};

// Reusable className generators
const navClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

const subNavClass = ({ isActive }) =>
    `flex items-center px-4 py-2 ml-4 text-sm rounded-md transition-all duration-200 ${
        isActive
            ? 'bg-blue-100 text-blue-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

export default SidebarForStaff;
