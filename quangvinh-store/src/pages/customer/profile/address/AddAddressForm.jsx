/**
 * Copyright (c) 2025 ngothangwork
 * Author: ngothangwork
 *
 * Component AddAddressForm: Form thêm mới địa chỉ giao hàng cho khách hàng.
 * Bao gồm nhập họ tên, số điện thoại, tỉnh/thành phố, phường/xã, địa chỉ chi tiết,
 * loại địa chỉ (nhà riêng, văn phòng, khác) và tùy chọn đặt làm địa chỉ chính.
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
/**
 * Component AddAddressForm
 * @param {Function} onAdd - Hàm callback khi thêm địa chỉ mới
 * @param {Function} onCancel - Hàm callback khi hủy thêm địa chỉ
 * Copyright (c) 2025 ngothangwork
 * Author: ngothangwork
 */
function AddAddressForm({ onAdd, onCancel }) {
    const [form, setForm] = useState({
        name: '',
        phoneNumber: '',
        exactAddress: '',
        type: 'Nhà riêng',
        main: false,
        province: '',
        ward: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    /**
     * useEffect: Lấy danh sách tỉnh từ API khi component mount
     * Copyright (c) 2025 ngothangwork
     * Author: ngothangwork
     */
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/v2/p/')
            .then(res => res.json())
            .then(setProvinces)
            .catch(error => {
                console.error('Lỗi khi tải danh sách tỉnh:', error);
                toast.error('Không thể tải danh sách tỉnh');
            });
    }, []);

    /**
     * useEffect: Lấy danh sách xã theo tỉnh đã chọn
     * Tự động reset khi province thay đổi
     * Copyright (c) 2025 ngothangwork
     * Author: ngothangwork
     */
    useEffect(() => {
        if (form.province) {
            fetch(`https://provinces.open-api.vn/api/v2/w/?province_code=${form.province}`)
                .then(res => res.json())
                .then(setWards)
                .catch(error => {
                    console.error('Lỗi khi tải danh sách xã:', error);
                });
        } else {
            setWards([]);
        }
    }, [form.province]);

    /**
     * Xử lý thay đổi dữ liệu trong form
     * @param {Event} e - Sự kiện onChange
     * Copyright (c) 2025 ngothangwork
     * Author: ngothangwork
     */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };


    /**
     * Xử lý submit form: tạo object địa chỉ và gọi callback onAdd
     * @param {Event} e - Sự kiện submit
     * Copyright (c) 2025 ngothangwork
     * Author: ngothangwork
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedProvince = provinces.find(p => p.code === Number(form.province))?.name || '';
        const selectedWard = wards.find(w => w.code === Number(form.ward))?.name || '';

        if (!selectedProvince || !selectedWard) {
            toast.error('Vui lòng chọn đầy đủ tỉnh và xã!');
            return;
        }

        const combinedAddress = `${selectedWard}, ${selectedProvince}`;

        const typeMap = {
            "Nhà riêng": "HOME",
            "Văn phòng": "WORK",
            "Khác": "OTHER",
        };

        const newAddress = {
            name: form.name,
            phoneNumber: form.phoneNumber,
            address: combinedAddress,
            exactAddress: form.exactAddress,
            main: form.main,
            type: typeMap[form.type],
            provinceCode: form.province,
            wardCode: form.ward,
        };

        onAdd(newAddress);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto"
        >
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Thêm địa chỉ mới</h3>

            {/* Họ tên */}
            <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                    className="w-full border border-gray-300 rounded-full py-2 px-3 sm:px-4 text-xs sm:text-sm"
                    required
                />
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full border border-gray-300 rounded-full py-2 px-3 sm:px-4 text-xs sm:text-sm"
                    required
                />
            </div>

            {/* Chọn tỉnh và xã */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
                    <select
                        name="province"
                        value={form.province}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-full py-2 px-3 sm:px-3 text-xs sm:text-sm"
                        required
                    >
                        <option value="">Chọn tỉnh</option>
                        {provinces.map(p => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Phường / Xã</label>
                    <select
                        name="ward"
                        value={form.ward}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-full py-2 px-3 sm:px-3 text-xs sm:text-sm"
                        required
                    >
                        <option value="">Chọn xã</option>
                        {wards.map(w => (
                            <option key={w.code} value={w.code}>{w.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Địa chỉ chi tiết */}
            <div className="flex flex-col">
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                <input
                    name="exactAddress"
                    value={form.exactAddress}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường..."
                    className="w-full border border-gray-300 rounded-full py-2 px-3 sm:px-4 text-xs sm:text-sm"
                    required
                />
            </div>

            {/* Loại địa chỉ */}
            <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Loại địa chỉ</label>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                    {["Nhà riêng", "Văn phòng", "Khác"].map((type) => (
                        <label key={type} className="flex items-center gap-2 text-xs sm:text-sm">
                            <input
                                type="radio"
                                name="type"
                                value={type}
                                checked={form.type === type}
                                onChange={handleChange}
                                className="h-4 w-4 text-gray-900"
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            {/* Đặt làm địa chỉ chính */}
            <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                <input
                    type="checkbox"
                    name="main"
                    checked={form.main}
                    onChange={handleChange}
                    className="h-4 w-4 text-gray-900"
                />
                Đặt làm địa chỉ chính
            </label>

            {/* Nút */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                    type="submit"
                    className="bg-green-300 text-green-800 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-green-600 hover:text-white transition w-full sm:w-auto"
                >
                    Lưu
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-red-300 text-red-800 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-red-600 hover:text-white transition w-full sm:w-auto"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}

export default AddAddressForm;