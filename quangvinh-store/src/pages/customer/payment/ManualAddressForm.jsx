import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ManualAddressForm() {
    const [form, setForm] = useState({
        province: '',
        ward: '',
        street: '',
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

    // Lấy danh sách phường khi chọn tỉnh
    useEffect(() => {
        if (form.province) {
            fetch(`https://provinces.open-api.vn/api/v2/w?province_code=${form.province}`)
                .then(res => res.json())
                .then(setWards)
                .catch(error => {
                    console.error('Lỗi khi tải danh sách phường:', error);
                    toast.error('Không thể tải danh sách phường');
                });
            setForm(prev => ({ ...prev, ward: '' }));
        } else {
            setWards([]);
        }
    }, [form.province]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="text-black text-lg font-semibold mb-2">
                Nhập địa chỉ giao hàng:
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                <select
                    name="province"
                    required
                    value={form.province}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-black"
                >
                    <option value="">Chọn tỉnh / thành phố*</option>
                    {provinces.map((prov) => (
                        <option key={prov.code} value={prov.code}>
                            {prov.name}
                        </option>
                    ))}
                </select>

                <select
                    name="ward"
                    required
                    value={form.ward}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-black"
                    disabled={!form.province}
                >
                    <option value="">Chọn phường / xã*</option>
                    {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                            {ward.name}
                        </option>
                    ))}
                </select>
            </div>

            <input
                type="text"
                name="street"
                placeholder="Số nhà, tên đường*"
                required
                value={form.street}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-black"
            />
        </div>
    );
}

export default ManualAddressForm;
