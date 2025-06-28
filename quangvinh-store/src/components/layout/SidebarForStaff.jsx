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
    Search,
    ShoppingBag,
    Tag,
    Receipt,
    Store,
    Megaphone,
    ChevronDown,
    ChevronRight
} from 'lucide-react';

const SidebarForStaff = () => {
    const location = useLocation();
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    // Auto open dropdown nếu đang ở trang categories hoặc product-types (chỉ lần đầu)
    useEffect(() => {
        if (location.pathname === '/categories' || location.pathname === '/product-types') {
            setCategoryDropdownOpen(true);
        }
    }, []); // Chỉ chạy 1 lần khi component mount

    // Hàm toggle dropdown - chỉ thay đổi khi click vào button chính
    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCategoryDropdownOpen(!categoryDropdownOpen);
    };

    return (
        <div className="w-80 bg-white shadow-lg h-full">
            <div className="p-6 border-b">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">QV</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">QUANG VINH</h1>
                        <p className="text-xs text-gray-500">AUTHENTIC STAFF</p>
                    </div>
                </div>
            </div>

            <nav className="mt-6 flex flex-col h-full">
                <div className="px-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-1 px-3">
                    <NavLink
                        to="/products-management"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <Package className="h-5 w-5" />
                        <span>Sản phẩm</span>
                    </NavLink>

                    {/* Category Dropdown - FIXED ABSOLUTE POSITION */}
                    <div className="relative">
                        {/* Main Category Button */}
                        <button
                            onClick={toggleDropdown}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                location.pathname === '/categories' || location.pathname === '/product-types'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Tag className="h-5 w-5" />
                                <span>Danh mục sản phẩm</span>
                            </div>
                            {categoryDropdownOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </button>

                        {/* Dropdown Items - ABSOLUTE POSITIONING */}
                        {categoryDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 z-50 bg-white shadow-lg border border-gray-200 rounded-lg mt-1">
                                <div className="py-1">
                                    <NavLink
                                        to="/categories"
                                        className={({ isActive }) =>
                                            `flex items-center px-6 py-2 text-sm transition-colors ${
                                                isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <span>Danh mục sản phẩm</span>
                                    </NavLink>
                                    <NavLink
                                        to="/product-types"
                                        className={({ isActive }) =>
                                            `flex items-center px-6 py-2 text-sm transition-colors ${
                                                isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <span>Loại trang phục</span>
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </div>

                    <NavLink
                        to="/customers"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <Users className="h-5 w-5" />
                        <span>Khách hàng</span>
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <Receipt className="h-5 w-5" />
                        <span>Hóa đơn</span>
                    </NavLink>

                    <NavLink
                        to="/feedbacks"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span>Feedback</span>
                    </NavLink>

                    <NavLink
                        to="/policies-management"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <FileText className="h-5 w-5" />
                        <span>Chính sách</span>
                    </NavLink>

                    <NavLink
                        to="/instruction-management"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <FileText className="h-5 w-5" />
                        <span>Hướng dẫn</span>
                    </NavLink>

                    <NavLink
                        to="/statistics"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <BarChart3 className="h-5 w-5" />
                        <span>Thống kê</span>
                    </NavLink>

                    <NavLink
                        to="/staff"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <UserPlus className="h-5 w-5" />
                        <span>Nhân viên</span>
                    </NavLink>

                    <NavLink
                        to="/store-management"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <Store className="h-5 w-5" />
                        <span>Quản lý cửa hàng</span>
                    </NavLink>

                    <NavLink
                        to="/campaign-management"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <Megaphone className="h-5 w-5" />
                        <span>Quản lý chiến dịch</span>
                    </NavLink>
                </div>

                {/* Bottom section */}
                <div className="px-3 pb-6 space-y-1 border-t pt-4 mt-4">
                    <NavLink
                        to="/settings-management"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <Settings className="h-5 w-5" />
                        <span>Cài đặt</span>
                    </NavLink>

                    <NavLink
                        to="/logout"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive ? 'bg-red-100 text-red-700' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                            }`
                        }
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Đăng xuất</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};

export default SidebarForStaff;
