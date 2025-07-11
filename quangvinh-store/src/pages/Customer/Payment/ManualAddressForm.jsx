import { useState } from 'react';

function ManualAddressForm() {
    const [form, setForm] = useState({
        province: '',
        district: '',
        ward: '',
        street: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="text-black text-lg font-semibold mb-2">Nhập địa chỉ giao hàng:</div>

            <input
                type="text"
                name="province"
                placeholder="Tỉnh / Thành phố*"
                required
                value={form.province}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-black"
            />

            <input
                type="text"
                name="district"
                placeholder="Quận / Huyện*"
                required
                value={form.district}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-black"
            />

            <input
                type="text"
                name="ward"
                placeholder="Phường / Xã*"
                required
                value={form.ward}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-black"
            />

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
