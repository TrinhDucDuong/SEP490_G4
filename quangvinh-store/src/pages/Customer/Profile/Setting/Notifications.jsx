import React, { useState } from 'react';

function Notifications() {
    const [settings, setSettings] = useState({
        emailOrder: true,
        emailPromo: false,
        smsImportant: true,
        smsPromo: true,
        zaloImportant: true,
        zaloPromo: true,
    });

    const toggle = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const renderToggle = (key, disabled = false) => (
        <button
            type="button"
            onClick={() => !disabled && toggle(key)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings[key] ? 'bg-indigo-600' : 'bg-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">CÀI ĐẶT THÔNG BÁO</h2>

            <div className="space-y-6 text-sm">
                <div>
                    <p className="font-semibold text-gray-900">Email thông báo</p>
                    <p className="text-gray-500 mb-3">Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt</p>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-gray-900 font-medium">Cập nhật đơn hàng</p>
                            <p className="text-gray-500 text-sm">Cập nhật về tình trạng vận chuyển của tất cả các đơn hàng</p>
                        </div>
                        {renderToggle('emailOrder')}
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-gray-900 font-medium">Email thông báo</p>
                            <p className="text-gray-500 text-sm">Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
                        </div>
                        {renderToggle('emailPromo')}
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-gray-900">Thông báo SMS</p>
                    <p className="text-gray-500 mb-3">Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt</p>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-gray-900 font-medium">Khuyến mãi</p>
                            <p className="text-gray-500 text-sm">Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
                        </div>
                        {renderToggle('smsPromo')}
                    </div>
                </div>

                <div>
                    <p className="font-semibold text-gray-900">Thông báo Zalo</p>
                    <p className="text-gray-500 mb-3">Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt</p>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-gray-900 font-medium">Khuyến mãi</p>
                            <p className="text-gray-500 text-sm">Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
                        </div>
                        {renderToggle('zaloPromo')}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notifications;
