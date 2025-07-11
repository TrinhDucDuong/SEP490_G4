import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthForManager } from '../../context/AuthContextForManager';
import Modal from '../common/Modals';

const LogoutButtonForManager = ({ className = "" }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { logout, user } = useAuthForManager();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <>
            <button
                onClick={() => setShowConfirmModal(true)}
                className={`flex items-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-md transition-colors ${className}`}
                title="Đăng xuất"
            >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
            </button>

            {/* Confirmation Modal */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
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
                            onClick={() => setShowConfirmModal(false)}
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

export default LogoutButtonForManager;
