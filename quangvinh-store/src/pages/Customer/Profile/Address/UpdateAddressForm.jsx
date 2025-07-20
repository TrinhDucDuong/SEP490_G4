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
        district: '',
        ward: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/?depth=1')
            .then(res => res.json())
            .then(setProvinces)
            .catch(error => {
                console.error('Lỗi khi tải danh sách tỉnh:', error);
                toast.error('Không thể tải danh sách tỉnh');
            });
    }, []);

    useEffect(() => {
        if (form.province) {
            fetch(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
                .then(res => res.json())
                .then(data => setDistricts(data.districts || []))
                .catch(error => {
                    console.error('Lỗi khi tải danh sách huyện:', error);
                    toast.error('Không thể tải danh sách huyện');
                });
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [form.province]);

    useEffect(() => {
        if (form.district) {
            fetch(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards || []))
                .catch(error => {
                    console.error('Lỗi khi tải danh sách xã:', error);
                    toast.error('Không thể tải danh sách xã');
                });
        } else {
            setWards([]);
        }
    }, [form.district]);

    useEffect(() => {
        const initializeAddress = async () => {
            if (currentAddress.address && provinces.length > 0) {
                const [wardName, districtName, provinceName] = currentAddress.address.split(', ').map(s => s.trim());

                const province = provinces.find(p => p.name === provinceName);
                if (province) {
                    setForm(prev => ({ ...prev, province: province.code.toString() }));

                    try {
                        const districtRes = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
                        const districtData = await districtRes.json();
                        const districtList = districtData.districts || [];
                        setDistricts(districtList);

                        const district = districtList.find(d => d.name === districtName);
                        if (district) {
                            setForm(prev => ({ ...prev, district: district.code.toString() }));

                            const wardRes = await fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
                            const wardData = await wardRes.json();
                            const wardList = wardData.wards || [];
                            setWards(wardList);

                            const ward = wardList.find(w => w.name === wardName);
                            if (ward) {
                                setForm(prev => ({ ...prev, ward: ward.code.toString() }));
                            }
                        }
                    } catch (error) {
                        console.error('Lỗi khi khởi tạo địa chỉ:', error);
                        toast.error('Không thể khởi tạo địa chỉ');
                    }
                }
            }
        };
        initializeAddress();
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
        const selectedDistrict = districts.find(d => d.code === Number(form.district))?.name || '';
        const selectedWard = wards.find(w => w.code === Number(form.ward))?.name || '';

        if (!selectedProvince || !selectedDistrict || !selectedWard) {
            toast.error('Vui lòng chọn đầy đủ tỉnh, huyện, xã!');
            return;
        }

        const combinedAddress = `${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;

        onUpdate({
            shippingAddressId: form.shippingAddressId,
            name: form.name,
            phoneNumber: form.phoneNumber,
            address: combinedAddress,
            exactAddress: form.exactAddress,
            main: form.main,
            type: mapTypeToEnum(form.type),
            provinceCode: form.province,
            districtCode: form.district,
            wardCode: form.ward,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-sm w-full max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900">Cập nhật địa chỉ</h3>

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
                        {provinces.map(p => (
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
                        {districts.map(d => (
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
                        {wards.map(w => (
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
                    name="main"
                    checked={form.main}
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
                    Cập nhật
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

export default UpdateAddressForm;