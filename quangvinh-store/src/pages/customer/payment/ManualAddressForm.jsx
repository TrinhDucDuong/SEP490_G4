import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ManualAddressForm({ value, onChange }) {
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/v2/p/')
            .then(res => res.json())
            .then(setProvinces)
            .catch(error => {
                console.error('Lỗi khi tải danh sách tỉnh:', error);
                toast.error('Không thể tải danh sách tỉnh');
            });
    }, []);

    useEffect(() => {
        if (value.province) {
            fetch(`https://provinces.open-api.vn/api/v2/w?province_code=${value.province}`)
                .then(res => res.json())
                .then(setWards)
                .catch(error => {
                    console.error('Lỗi khi tải danh sách phường:', error);
                    toast.error('Không thể tải danh sách phường');
                });
            onChange({ ...value, ward: '' });
        } else {
            setWards([]);
        }
    }, [value.province]);

    const handleChange = (e) => {
        const { name, value: val } = e.target;
        onChange({ ...value, [name]: val });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                <select
                    name="province"
                    required
                    value={value.province}
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
                    value={value.ward}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 text-black"
                    disabled={!value.province}
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
                value={value.street}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-black"
            />
        </div>
    );
}

export default ManualAddressForm;
