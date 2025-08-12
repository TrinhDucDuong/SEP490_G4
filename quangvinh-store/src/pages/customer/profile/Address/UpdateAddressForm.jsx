import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function UpdateAddressForm({ currentAddress, onUpdate, onCancel }) {
    const [form, setForm] = useState({
        shippingAddressId: currentAddress.shippingAddressId || '',
        name: currentAddress.name || '',
        phoneNumber: currentAddress.phoneNumber || '',
        address: currentAddress.address || '',
        exactAddress: currentAddress.exactAddress || '',
        main: currentAddress.isMain || false,
        type: currentAddress.type === 'HOME' ? 'Nhà riêng' : currentAddress.type === 'OFFICE' ? 'Văn phòng' : 'Khác',
        province: '',
        ward: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    // Lấy danh sách tỉnh
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/v2/p/')
            .then(res => res.json())
            .then(setProvinces)
            .catch(error => {
                console.error('Lỗi khi tải danh sách tỉnh:', error);
                toast.error('Không thể tải danh sách tỉnh');
            });
    }, []);

    // Khi chọn tỉnh → load danh sách xã/phường
    useEffect(() => {
        if (form.province) {
            fetch(`https://provinces.open-api.vn/api/v2/w/?province_code=${form.province}`)
                .then(res => res.json())
                .then(setWards)
                .catch(error => {
                    console.error('Lỗi khi tải danh sách xã:', error);
                    toast.error('Không thể tải danh sách xã');
                });
        } else {
            setWards([]);
        }
    }, [form.province]);

    // Khởi tạo từ địa chỉ cũ
    useEffect(() => {
        const initAddress = async () => {
            if (currentAddress.address && provinces.length > 0) {
                const [wardName, provinceName] = currentAddress.address.split(', ').map(s => s.trim());
                const province = provinces.find(p => p.name === provinceName);
                if (province) {
                    setForm(prev => ({ ...prev, province: province.code.toString() }));

                    try {
                        const wardRes = await fetch(`https://provinces.open-api.vn/api/v2/w/?province_code=${province.code}`);
                        const wardList = await wardRes.json();
                        setWards(wardList);

                        const ward = wardList.find(w => w.name === wardName);
                        if (ward) {
                            setForm(prev => ({ ...prev, ward: ward.code.toString() }));
                        }
                    } catch (error) {
                        console.error('Lỗi khi khởi tạo xã:', error);
                    }
                }
            }
        };
        initAddress();
    }, [currentAddress.address, provinces]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const mapTypeToEnum = (type) => {
        if (type === 'Nhà riêng') return 'HOME';
        if (type === 'Văn phòng') return 'OFFICE';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedProvince = provinces.find(p => p.code === Number(form.province))?.name || '';
        const selectedWard = wards.find(w => w.code === Number(form.ward))?.name || '';

        if (!selectedProvince || !selectedWard) {
            toast.error('Vui lòng chọn đầy đủ tỉnh và xã/phường!');
            return;
        }

        const combinedAddress = `${selectedWard}, ${selectedProvince}`;

        onUpdate({
            shippingAddressId: form.shippingAddressId,
            name: form.name,
            phoneNumber: form.phoneNumber,
            address: combinedAddress,
            exactAddress: form.exactAddress,
            main: form.main,
            type: mapTypeToEnum(form.type),
            provinceCode: form.province,
            wardCode: form.ward,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-sm w-full max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900">Cập nhật địa chỉ</h3>

            {/* Họ tên */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Họ tên</label>
                <input name="name" value={form.name} onChange={handleChange} required className="border rounded-full py-2 px-4 text-sm" />
            </div>

            {/* SĐT */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Số điện thoại</label>
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="border rounded-full py-2 px-4 text-sm" />
            </div>

            {/* Tỉnh & Xã */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Tỉnh / Thành phố</label>
                    <select name="province" value={form.province} onChange={handleChange} required className="border rounded-full py-2 px-3 text-sm">
                        <option value="">Chọn tỉnh</option>
                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Phường / Xã</label>
                    <select name="ward" value={form.ward} onChange={handleChange} required className="border rounded-full py-2 px-3 text-sm">
                        <option value="">Chọn xã</option>
                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Địa chỉ chi tiết */}
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Địa chỉ chi tiết</label>
                <input name="exactAddress" value={form.exactAddress} onChange={handleChange} required className="border rounded-full py-2 px-4 text-sm" />
            </div>

            {/* Loại địa chỉ */}
            <div>
                <label className="block text-sm font-medium mb-1">Loại địa chỉ</label>
                <div className="flex gap-6">
                    {["Nhà riêng", "Văn phòng", "Khác"].map((type) => (
                        <label key={type} className="flex items-center gap-2 text-sm">
                            <input type="radio" name="type" value={type} checked={form.type === type} onChange={handleChange} />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="main" checked={form.main} onChange={handleChange} />
                Đặt làm địa chỉ chính
            </label>

            <div className="flex gap-3">
                <button type="submit" className="bg-green-300 px-6 py-1 rounded-full hover:bg-green-600 hover:text-white">Cập nhật</button>
                <button type="button" onClick={onCancel} className="bg-red-300 px-6 py-1 rounded-full hover:bg-red-600 hover:text-white">Hủy</button>
            </div>
        </form>
    );
}

export default UpdateAddressForm;
