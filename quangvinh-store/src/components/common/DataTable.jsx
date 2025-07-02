import React, { useState, useEffect } from 'react';
import { Clock, History, X, User, Calendar } from 'lucide-react';

const DataTable = ({
                       columns,
                       data,
                       onRowClick,
                       className = "",
                       emptyMessage = "Không có dữ liệu",
                       showLastUpdated = true,
                   }) => {
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [updateHistory, setUpdateHistory] = useState([]);

    // Tự động lấy thời gian hiện tại
    const getCurrentTime = () => {
        return new Date().toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    // Khởi tạo lịch sử cập nhật mẫu
    useEffect(() => {
        const sampleHistory = [
            {
                id: 1,
                timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 phút trước
                user: 'Admin',
                action: 'Cập nhật dữ liệu sản phẩm',
                details: 'Làm mới toàn bộ danh sách sản phẩm từ cơ sở dữ liệu'
            },
            {
                id: 2,
                timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 phút trước
                user: 'Staff1',
                action: 'Thêm sản phẩm mới',
                details: 'Thêm sản phẩm "Áo thun nam Nike Air" vào hệ thống'
            },
            {
                id: 3,
                timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
                user: 'Admin',
                action: 'Cập nhật trạng thái',
                details: 'Thay đổi trạng thái sản phẩm SP003 thành "Đã ngừng bán"'
            },
            {
                id: 4,
                timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 giờ trước
                user: 'Staff2',
                action: 'Cập nhật số lượng',
                details: 'Cập nhật số lượng tồn kho cho 5 sản phẩm'
            },
            {
                id: 5,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 giờ trước
                user: 'Admin',
                action: 'Đồng bộ dữ liệu',
                details: 'Đồng bộ dữ liệu với hệ thống kho'
            }
        ];
        setUpdateHistory(sampleHistory);
    }, []);

    // Format thời gian cho lịch sử
    const formatHistoryTime = (date) => {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    };

    // History Modals Component
    const HistoryModal = () => {
        if (!showHistoryModal) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={() => setShowHistoryModal(false)}
                />

                {/* Modals */}
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <History className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Lịch sử cập nhật</h3>
                                    <p className="text-sm text-gray-600">Danh sách các lần cập nhật gần đây</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-96">
                            <div className="space-y-4">
                                {updateHistory.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        {/* Timeline dot */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${
                                                index === 0 ? 'bg-green-500' : 'bg-blue-500'
                                            }`} />
                                            {index < updateHistory.length - 1 && (
                                                <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-semibold text-gray-900">
                                                    {item.action}
                                                </h4>
                                                <span className="text-xs text-gray-500">
                                                    {formatHistoryTime(item.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {item.details}
                                            </p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{item.user}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{item.timestamp.toLocaleString('vi-VN')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Tổng cộng {updateHistory.length} lần cập nhật
                                </span>
                                <button
                                    onClick={() => setShowHistoryModal(false)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>

                {showLastUpdated && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>Cập nhật lần cuối:</span>
                                <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                    {getCurrentTime()}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowHistoryModal(true)}
                                className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <History className="w-4 h-4" />
                                <span>Hiển thị lịch sử cập nhật</span>
                            </button>
                        </div>
                    </div>
                )}
                <HistoryModal />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="p-4 space-y-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((column) => {
                                if (column.mobileRender) {
                                    return column.mobileRender(item, index);
                                }
                                return null;
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
                <table className={`w-full ${className}`}>
                    <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-4 py-4 font-semibold text-gray-900 ${column.headerAlign || 'text-left'} ${column.headerClassName || ''} ${column.hideOnMobile ? 'hidden md:table-cell' : ''} ${column.hideOnTablet ? 'hidden lg:table-cell' : ''} ${column.hideOnDesktop ? 'hidden xl:table-cell' : ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr
                            key={item.id || index}
                            className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${onRowClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`px-4 py-4 ${column.cellAlign || 'text-left'} ${column.cellClassName || ''} ${column.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                                >
                                    {column.render ? column.render(item, index) : item[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* FOOTER VỚI BUTTON LỊCH SỬ */}
            {showLastUpdated && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-6">
                        {/* Cập nhật lần cuối */}
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Cập nhật lần cuối:</span>
                            <span className="font-mono text-gray-700 bg-white px-3 py-1 rounded border shadow-sm">
                                {getCurrentTime()}
                            </span>
                        </div>

                        {/* Button lịch sử */}
                        <button
                            onClick={() => setShowHistoryModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                        >
                            <History className="w-4 h-4" />
                            <span>Hiển thị lịch sử cập nhật</span>
                        </button>
                    </div>
                </div>
            )}

            {/* History Modals */}
            <HistoryModal />
        </div>
    );
};

export default DataTable;
