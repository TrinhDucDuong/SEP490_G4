import React, { useState, useEffect } from 'react';

function AddAddressForm({ onAdd, onCancel }) {
    const [form, setForm] = useState({
        name: '',
        phoneNumber: '',
        province: '',
        district: '',
        ward: '',
        exactAddress: '',
        isMain: false,
        type: 'Nhà riêng',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/?depth=1')
            .then(res => res.json())
            .then(setProvinces)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (form.province) {
            fetch(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
                .then(res => res.json())
                .then(data => setDistricts(data.districts || []));
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [form.province]);

    useEffect(() => {
        if (form.district) {
            fetch(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards || []));
        } else {
            setWards([]);
        }
    }, [form.district]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedProvince = provinces.find(p => p.code === Number(form.province))?.name || '';
        const selectedDistrict = districts.find(d => d.code === Number(form.district))?.name || '';
        const selectedWard = wards.find(w => w.code === Number(form.ward))?.name || '';

        const combinedAddress = `${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;

        onAdd({
            ...form,
            address: combinedAddress,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Thêm địa chỉ mới</h3>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                    className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
                    <select
                        name="province"
                        value={form.province}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-full py-2 px-3 text-sm"
                        required
                    >
                        <option value="">Chọn tỉnh</option>
                        {provinces.map((p) => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
                    <select
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-full py-2 px-3 text-sm"
                        required
                    >
                        <option value="">Chọn huyện</option>
                        {districts.map((d) => (
                            <option key={d.code} value={d.code}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Phường / Xã</label>
                    <select
                        name="ward"
                        value={form.ward}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-full py-2 px-3 text-sm"
                        required
                    >
                        <option value="">Chọn xã</option>
                        {wards.map((w) => (
                            <option key={w.code} value={w.code}>{w.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                <input
                    name="exactAddress"
                    value={form.exactAddress}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường..."
                    className="w-full border border-gray-300 rounded-full py-2 px-4 text-sm"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại địa chỉ</label>
                <div className="flex gap-6">
                    {["Nhà riêng", "Văn phòng", "Khác"].map((type) => (
                        <label key={type} className="flex items-center gap-2 text-sm">
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

            <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                    type="checkbox"
                    name="isMain"
                    checked={form.isMain}
                    onChange={handleChange}
                    className="h-4 w-4 text-gray-900"
                />
                Đặt làm địa chỉ chính
            </label>
            <div className="flex gap-3">
                <button
                    type="submit"
                    className="bg-green-300 text-green-800 px-6 py-1 rounded-full text-sm font-medium hover:bg-green-600 hover:text-white transition"
                >
                    Thêm
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-red-300 text-red-800 px-6 py-1 rounded-full text-sm font-medium hover:bg-red-600 hover:text-white transition"
                >
                    Hủy
                </button>
            </div>
        </form>
    );
}

export default AddAddressForm;
