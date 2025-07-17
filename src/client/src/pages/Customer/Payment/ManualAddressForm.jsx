import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ManualAddressForm() {
    const [form, setForm] = useState({
        province: '',
        district: '',
        ward: '',
        street: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Lấy danh sách tỉnh
    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/?depth=1')
            .then(res => res.json())
            .then(setProvinces)
            .catch(error => {
                console.error('Lỗi khi tải danh sách tỉnh:', error);
                toast.error('Không thể tải danh sách tỉnh');
            });
    }, []);

    // Lấy danh sách huyện theo tỉnh
    useEffect(() => {
        if (form.province) {
            fetch(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`)
                .then(res => res.json())
                .then(data => setDistricts(data.districts || []))
                .catch(error => {
                    console.error('Lỗi khi tải danh sách huyện:', error);
                    toast.error('Không thể tải danh sách huyện');
                });
            setWards([]);
            setForm(prev => ({ ...prev, district: '', ward: '' }));
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
            setForm(prev => ({ ...prev, ward: '' }));
        } else {
            setWards([]);
        }
    }, [form.district]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="text-black text-lg font-semibold mb-2">Nhập địa chỉ giao hàng:</div>

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
                    name="district"
                    required
                    value={form.district}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-black"
                    disabled={!form.province}
                >
                    <option value="">Chọn quận / huyện*</option>
                    {districts.map((dist) => (
                        <option key={dist.code} value={dist.code}>
                            {dist.name}
                        </option>
                    ))}
                </select>

                <select
                    name="ward"
                    required
                    value={form.ward}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-black"
                    disabled={!form.district}
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
