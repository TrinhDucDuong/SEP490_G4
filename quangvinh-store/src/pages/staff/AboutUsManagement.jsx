import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { User, Package, Users, FileText, MessageSquare, Wifi, BarChart3, UserPlus, Settings, LogOut, Search, Filter, X, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarForAdmin from '../../components/layout/admin/SidebarForAdmin.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';


const AboutUsManagement = () => {
    const [stores, setStores] = useState({});
    const [selectedStore, setSelectedStore] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [storeToDelete, setStoreToDelete] = useState(null);
    const [newStore, setNewStore] = useState({ name: '', mapLink: '', phone: '' });
    const [updateStore, setUpdateStore] = useState({ id: null, name: '', mapLink: '', phone: '' });
    const location = useLocation();

    useEffect(() => {
        const sampleStores = {
            'Quang Vinh Authentic - Quán Thánh 1': { mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.753709646254!2d105.83980771171757!3d21.042538487222657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0054e8c877%3A0x33e5f8cda24163e8!2sQuang%20Vinh%20Authentic!5e0!3m2!1sen!2s!4v1749781886297!5m2!1sen!2s', phone: '0123456789' },
            'Quang Vinh Authentic - Quán Thánh 2': { mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.753709646254!2d105.83980771171757!3d21.042538487222657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0054e8c877%3A0x33e5f8cda24163e8!2sQuang%20Vinh%20Authentic!5e0!3m2!1sen!2s!4v1749781886297!5m2!1sen!2s', phone: '0123456790' },
            'Quang Vinh Authentic - Quán Thánh 3': { mapLink: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.753709646254!2d105.83980771171757!3d21.042538487222657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0054e8c877%3A0x33e5f8cda24163e8!2sQuang%20Vinh%20Authentic!5e0!3m2!1sen!2s!4v1749781886297!5m2!1sen!2s', phone: '0123456791' },
        };
        setStores(sampleStores);
    }, []);

    const handleCreate = () => {
        if (!newStore.name.trim() || !newStore.mapLink.trim()) return;
        const updatedStores = { ...stores, [newStore.name]: { mapLink: newStore.mapLink, phone: newStore.phone } };
        setStores(updatedStores);
        setShowCreatePopup(false);
        setNewStore({ name: '', mapLink: '', phone: '' });
    };

    const handleUpdate = () => {
        if (!updateStore.name.trim() || !updateStore.mapLink.trim()) return;
        const updatedStores = { ...stores };
        if (updateStore.originalName && updateStore.originalName !== updateStore.name) {
            delete updatedStores[updateStore.originalName];
        }
        updatedStores[updateStore.name] = { mapLink: updateStore.mapLink, phone: updateStore.phone };
        setStores(updatedStores);
        setShowUpdatePopup(false);
        setUpdateStore({ id: null, name: '', mapLink: '', phone: '' });
    };

    const handleDelete = (name) => {
        const updatedStores = { ...stores };
        delete updatedStores[name];
        setStores(updatedStores);
        setShowDeletePopup(false);
        setStoreToDelete(null);
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
        <div>
            <div>
                {/* Main Content */}
                <div className="mb-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Quản Lý Cửa Hàng
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Quản lý các hệ thống cửa hàng
                        </p>
                        </div>
                    </div>


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
                                    <option>Địa chỉ cửa hàng</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setShowCreatePopup(true)}
                                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Thêm Cửa Hàng</span>
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg shadow">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="text-left px-6 py-4 font-medium text-gray-900 w-1/12">ID</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-900 w-3/12">Địa chỉ cửa hàng</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-900 w-6/12">Link Google Map</th>
                                    <th className="text-left px-6 py-4 font-medium text-gray-900 w-2/12">Hành Động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.keys(stores).map((name, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center font-mono text-sm">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="px-6 py-4">{name}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedStore({ name, mapLink: stores[name].mapLink, phone: stores[name].phone })}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Xem Link
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setUpdateStore({
                                                            id: index,
                                                            name,
                                                            originalName: name,
                                                            mapLink: stores[name].mapLink,
                                                            phone: stores[name].phone,
                                                        });
                                                        setShowUpdatePopup(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setStoreToDelete(name);
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
                                        Hiện thị 1-{Object.keys(stores).length} of {Object.keys(stores).length}
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
                                <h2 className="text-xl font-semibold">Thêm Cửa Hàng Mới</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ cửa hàng</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={newStore.name}
                                        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                                        placeholder="Nhập địa chỉ cửa hàng"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Google Map</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={newStore.mapLink}
                                        onChange={(e) => setNewStore({ ...newStore, mapLink: e.target.value })}
                                        placeholder="Nhập link Google Map"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={newStore.phone}
                                        onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                                        placeholder="Nhập số điện thoại"
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
                                <h2 className="text-xl font-semibold">Cập Nhật Cửa Hàng</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ cửa hàng</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={updateStore.name}
                                        onChange={(e) => setUpdateStore({ ...updateStore, name: e.target.value })}
                                        placeholder="Nhập địa chỉ cửa hàng"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Google Map</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={updateStore.mapLink}
                                        onChange={(e) => setUpdateStore({ ...updateStore, mapLink: e.target.value })}
                                        placeholder="Nhập link Google Map"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={updateStore.phone}
                                        onChange={(e) => setUpdateStore({ ...updateStore, phone: e.target.value })}
                                        placeholder="Nhập số điện thoại"
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
                                    Bạn có chắc chắn muốn xóa cửa hàng <strong>"{storeToDelete}"</strong> không?
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowDeletePopup(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Quay Lại
                                    </button>
                                    <button
                                        onClick={() => handleDelete(storeToDelete)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Map Popup */}
                {selectedStore && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-2/3 max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold">{selectedStore.name}</h2>
                            </div>
                            <div className="p-6">
                                <iframe
                                    src={selectedStore.mapLink}
                                    width="100%"
                                    height="400"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                                <p className="mt-4 text-gray-600">SĐT / Zalo: {selectedStore.phone}</p>
                            </div>
                            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                                <button
                                    onClick={() => setSelectedStore(null)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutUsManagement;