/**
 * @file ManualAddressForm.jsx
 * @description Form nhập địa chỉ thủ công (tỉnh/thành phố, phường/xã, đường phố).
 * Sử dụng API `https://provinces.open-api.vn` để lấy dữ liệu địa phương.
 *
 * @module ManualAddressForm
 * @author ngothangwork
 * @copyright Copyright (c) 2025 ngothangwork
 */

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

/**
 * Component nhập địa chỉ thủ công khi người dùng chưa có địa chỉ trong tài khoản.
 *
 * @component
 * @param {Object} props - Props của component
 * @param {Object} props.value - Giá trị hiện tại của form địa chỉ
 * @param {string} props.value.province - Mã tỉnh/thành phố
 * @param {string} props.value.ward - Mã phường/xã
 * @param {string} props.value.street - Địa chỉ chi tiết (số nhà, tên đường)
 * @param {function} props.onChange - Callback khi giá trị form thay đổi
 *
 * @example
 * const [address, setAddress] = useState({ province: '', ward: '', street: '' });
 *
 * <ManualAddressForm
 *   value={address}
 *   onChange={setAddress}
 * />
 *
 * @returns {JSX.Element} Form nhập địa chỉ thủ công
 */
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

    /**
     * Xử lý thay đổi input và gọi hàm onChange từ parent.
     *
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Sự kiện thay đổi input
     */
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
