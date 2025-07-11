import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { User, Package, Users, FileText, MessageSquare, Wifi, BarChart3, UserPlus, Settings, LogOut, Search, Filter, X, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarForAdmin from '../../components/layout/admin/SidebarForAdmin.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';

const InstructionManagement = () => {
    const [guides, setGuides] = useState({});
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [guideToDelete, setGuideToDelete] = useState(null);
    const [newGuide, setNewGuide] = useState({ name: '', content: '', status: 'ACTIVE' });
    const [updateGuide, setUpdateGuide] = useState({ id: null, name: '', content: '', status: 'ACTIVE' });
    const location = useLocation();

    useEffect(() => {
        const sampleGuides = {
            'Hướng Dẫn Về Điểm Thành Viên': { content: '<p>Hướng dẫn chi tiết về hệ thống điểm thành viên và cách tích lũy điểm.</p>', status: 'ACTIVE' },
            'Hướng Dẫn Đặt Hàng': { content: '<p>Hướng dẫn từng bước để đặt hàng trên website.</p>', status: 'INACTIVE' },
            'Hướng Dẫn Chọn Kích Cỡ': { content: '<p>Hướng dẫn chọn kích cỡ phù hợp cho từng loại sản phẩm.</p>', status: 'ACTIVE' },
            'Hướng Dẫn Bảo Quản Sản Phẩm': { content: '<p>Hướng dẫn bảo quản sản phẩm để giữ chất lượng tốt nhất.</p>', status: 'ACTIVE' },
            'Hướng Dẫn Thanh Toán': { content: '<p>Hướng dẫn các phương thức thanh toán có sẵn.</p>', status: 'INACTIVE' },
        };
        setGuides(sampleGuides);
    }, []);

    const handleCreate = () => {
        if (!newGuide.name.trim()) return;
        const updatedGuides = { ...guides, [newGuide.name]: { content: newGuide.content, status: newGuide.status } };
        setGuides(updatedGuides);
        setShowCreatePopup(false);
        setNewGuide({ name: '', content: '', status: 'ACTIVE' });
    };

    const handleUpdate = () => {
        if (!updateGuide.name.trim()) return;
        const updatedGuides = { ...guides };
        if (updateGuide.originalName && updateGuide.originalName !== updateGuide.name) {
            delete updatedGuides[updateGuide.originalName];
        }
        updatedGuides[updateGuide.name] = { content: updateGuide.content, status: updateGuide.status };
        setGuides(updatedGuides);
        setShowUpdatePopup(false);
        setUpdateGuide({ id: null, name: '', content: '', status: 'ACTIVE' });
    };

    const handleDelete = (name) => {
        const updatedGuides = { ...guides };
        delete updatedGuides[name];
        setGuides(updatedGuides);
        setShowDeletePopup(false);
        setGuideToDelete(null);
    };

    const getStatusColor = (status) => {
        return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getStatusText = (status) => {
        return status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động';
    };

    const CKEditorComponent = ({ value, onChange, placeholder }) => (
        <div className="border border-gray-300 rounded-lg">
            <CKEditor
                editor={ClassicEditor}
                data={value}
                config={{
                    placeholder: placeholder,
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'],
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
        </div>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-blue-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">QV</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">QUANG VINH</h1>
                            <p className="text-xs text-gray-500">AUTHENTIC</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-6">
                    <div className="px-6 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 px-3">
                        <NavLink to="/products" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <Package className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Sản phẩm</span>
                        </NavLink>
                        <NavLink to="/categories" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <FileText className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Danh mục sản phẩm</span>
                        </NavLink>
                        <NavLink to="/customers" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <Users className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Khách hàng</span>
                        </NavLink>
                        <NavLink to="/orders" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <FileText className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Hóa đơn</span>
                        </NavLink>
                        <NavLink to="/feedbacks" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <MessageSquare className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Feedback</span>
                        </NavLink>
                        <NavLink to="/policies-management" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <Settings className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Chính sách</span>
                        </NavLink>
                        <NavLink to="/instruction-management" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <FileText className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Hướng dẫn</span>
                        </NavLink>
                        <NavLink to="/statistics" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <BarChart3 className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Thống kê</span>
                        </NavLink>
                        <NavLink to="/staff" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <UserPlus className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Nhân viên</span>
                        </NavLink>
                        <NavLink to="/store-management" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <Users className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Quản lý cửa hàng</span>
                        </NavLink>
                        <NavLink to="/campaign-management" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <Settings className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Quản lý chiến dịch</span>
                        </NavLink>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                        <NavLink to="/settings" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <Settings className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Cài đặt</span>
                        </NavLink>
                        <NavLink to="/logout" className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
                            <LogOut className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-700">Đăng xuất</span>
                        </NavLink>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900">Quản Lý Hướng Dẫn</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium">Ngô Quang Thắng</p>
                                    <p className="text-xs text-gray-500">Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-6">
                    {/* Controls */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Filter className="h-4 w-4" />
                                <span>Lọc</span>
                            </button>
                            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                <X className="h-4 w-4" />
                                <span>Xóa lọc</span>
                            </button>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg">
                                <option>Tên hướng dẫn</option>
                            </select>
                            <select className="px-4 py-2 border border-gray-300 rounded-lg">
                                <option>Trạng thái</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setShowCreatePopup(true)}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Thêm Hướng Dẫn</span>
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left px-6 py-4 font-medium text-gray-900 w-1/12">ID</th>
                                <th className="text-left px-6 py-4 font-medium text-gray-900 w-3/12">Tên Hướng Dẫn</th>
                                <th className="text-left px-6 py-4 font-medium text-gray-900 w-2/12">Nội Dung Hướng Dẫn</th>
                                <th className="text-left px-6 py-4 font-medium text-gray-900 w-2/12">Trạng thái</th>
                                <th className="text-left px-6 py-4 font-medium text-gray-900 w-4/12">Hành Động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(guides).map((name, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-center font-mono text-sm">{String(index + 1).padStart(2, '0')}</td>
                                    <td className="px-6 py-4">{name}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedGuide({ name, content: guides[name].content })}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Nội Dung
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(guides[name].status)}`}>
                        {getStatusText(guides[name].status)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setUpdateGuide({
                                                        id: index,
                                                        name,
                                                        originalName: name,
                                                        content: guides[name].content,
                                                        status: guides[name].status,
                                                    });
                                                    setShowUpdatePopup(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setGuideToDelete(name);
                                                    setShowDeletePopup(true);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t bg-gray-50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    Hiện thị 1-{Object.keys(guides).length} of {Object.keys(guides).length}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">‹</button>
                                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">›</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Popup */}
            {showCreatePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold">Thêm Hướng Dẫn Mới</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên Hướng Dẫn</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={newGuide.name}
                                    onChange={(e) => setNewGuide({ ...newGuide, name: e.target.value })}
                                    placeholder="Nhập tên hướng dẫn"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={newGuide.status}
                                    onChange={(e) => setNewGuide({ ...newGuide, status: e.target.value })}
                                >
                                    <option value="ACTIVE">Đang Hoạt Động</option>
                                    <option value="INACTIVE">Ngưng Hoạt Động</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                                <CKEditorComponent
                                    value={newGuide.content}
                                    onChange={(data) => setNewGuide({ ...newGuide, content: data })}
                                    placeholder="Nhập nội dung hướng dẫn..."
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCreatePopup(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Quay Lại
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Áp Dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Popup */}
            {showUpdatePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold">Cập Nhật Hướng Dẫn</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên Hướng Dẫn</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={updateGuide.name}
                                    onChange={(e) => setUpdateGuide({ ...updateGuide, name: e.target.value })}
                                    placeholder="Nhập tên hướng dẫn"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={updateGuide.status}
                                    onChange={(e) => setUpdateGuide({ ...updateGuide, status: e.target.value })}
                                >
                                    <option value="ACTIVE">Đang Hoạt Động</option>
                                    <option value="INACTIVE">Ngưng Hoạt Động</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                                <CKEditorComponent
                                    value={updateGuide.content}
                                    onChange={(data) => setUpdateGuide({ ...updateGuide, content: data })}
                                    placeholder="Nhập nội dung hướng dẫn..."
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowUpdatePopup(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Quay Lại
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                Áp Dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Popup */}
            {showDeletePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-96">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Xác Nhận Xóa</h2>
                            <p className="text-gray-600 mb-6">
                                Bạn có chắc chắn muốn xóa hướng dẫn <strong>"{guideToDelete}"</strong> không?
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeletePopup(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Quay Lại
                                </button>
                                <button
                                    onClick={() => handleDelete(guideToDelete)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Content Popup */}
            {selectedGuide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold">{selectedGuide.name}</h2>
                        </div>
                        <div className="p-6">
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedGuide.content }} />
                        </div>
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedGuide(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructionManagement;