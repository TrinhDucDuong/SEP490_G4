/**
 * Info.jsx
 *
 * Copyright (c) 2025 ngothangwork
 * Author: ngothangwork
 *
 * Description:
 *   Component React cho phép người dùng xem và cập nhật hồ sơ cá nhân (profile).
 *   Bao gồm cập nhật họ tên, email, số điện thoại, giới tính, ngày sinh và ảnh đại diện.
 *
 * Dependencies:
 *   - React (useState, useEffect, useContext)
 *   - react-toastify (toast) để hiển thị thông báo
 *   - AuthContext để lấy thông tin user và token
 */

import {useContext, useEffect, useState} from "react";
import { toast } from "react-toastify";
import {AuthContext} from "../../../../context/AuthContext.jsx";

/**
 * Component Info
 *
 * Hiển thị form thông tin cá nhân và cho phép chỉnh sửa.
 *
 * @returns {JSX.Element} Giao diện hồ sơ người dùng
 */

function Info() {
    const { user, token, login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dob: { year: "2000", month: "01", day: "01" },
        avatarFile: null,
        avatarUrl: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        if (user?.profile) {
            const profile = user.profile;
            const [year, month, day] = profile.birthDate?.split("-") || ["2000", "01", "01"];
            setFormData({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber || "",
                gender: profile.gender || "",
                dob: { year, month, day },
                avatarFile: null,
                avatarUrl: profile.profileImage?.imageUrl || null,
            });
            setAvatarPreview(profile.profileImage?.imageUrl || null);
        }
    }, [user]);

    useEffect(() => {
        if (formData.avatarFile) {
            const url = URL.createObjectURL(formData.avatarFile);
            setAvatarPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [formData.avatarFile]);

    /**
     * Xử lý thay đổi input text
     * @param {string} field - tên field cần thay đổi
     * @param {string} value - giá trị mới
     */

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /**
     * Xử lý thay đổi ngày sinh
     * @param {"year"|"month"|"day"} part - phần ngày/tháng/năm
     * @param {string} value - giá trị mới
     */
    const handleDobChange = (part, value) => {
        setFormData((prev) => ({
            ...prev,
            dob: { ...prev.dob, [part]: value },
        }));
    };

    /**
     * Xử lý chọn file ảnh đại diện
     * @param {Event} e - sự kiện input file
     */
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, avatarFile: file }));
        }
    };

    /**
     * Submit form cập nhật hồ sơ
     * @param {Event} e - sự kiện submit
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { year, month, day } = formData.dob;
        const birthDate = `${year}-${month}-${day}`;

        if (!formData.firstName || !formData.lastName) return toast.error("Vui lòng nhập họ và tên");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("Email không hợp lệ");
        if (!/^\d{10}$/.test(formData.phoneNumber)) return toast.error("Số điện thoại không hợp lệ");

        const form = new FormData();

        const profileInputData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            birthDate,
            gender: formData.gender,
        };

        form.append("profileInputData", new Blob([JSON.stringify(profileInputData)], { type: "application/json" }));

        if (formData.avatarFile) {
            form.append("profileImage", formData.avatarFile);
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            if (res.ok) {
                const updatedUser = await res.json();
                if (typeof login === "function") login(updatedUser, token);
                toast.success("Cập nhật hồ sơ thành công!");
            } else {
                const msg = await res.text();
                console.error(msg);
                toast.error("Cập nhật thất bại!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi kết nối máy chủ");
        }
    };

    const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

    return (
        <div className="flex flex-col lg:flex-row">
            <section className="flex-1 bg-white rounded shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-2">Hồ sơ của tôi</h2>
                <p className="text-sm text-gray-500 mb-6">Cập nhật thông tin cá nhân</p>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <Input label="Họ" id="lastName" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                        <Input label="Tên" id="firstName" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                        <Input label="Email" id="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                        <Input label="Số điện thoại" id="phone" value={formData.phoneNumber} onChange={(e) => handleChange("phoneNumber", e.target.value)} />

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Giới tính</label>
                            <div className="flex gap-6">
                                {["MALE", "FEMALE", "OTHER"].map((g) => (
                                    <label key={g} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={formData.gender === g}
                                            onChange={() => handleChange("gender", g)}
                                            className="h-4 w-4 text-gray-900"
                                        />
                                        {g === "MALE" ? "Nam" : g === "FEMALE" ? "Nữ" : "Khác"}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Ngày sinh</label>
                            <div className="grid grid-cols-3 gap-2">
                                <Select options={years} value={formData.dob.year} onChange={(e) => handleDobChange("year", e.target.value)} />
                                <Select options={months} value={formData.dob.month} onChange={(e) => handleDobChange("month", e.target.value)} />
                                <Select options={days} value={formData.dob.day} onChange={(e) => handleDobChange("day", e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" className="mt-6 w-full border border-black md:w-24 bg-black text-white py-2 rounded-sm font-semibold hover:bg-white hover:text-black transition">
                            Lưu
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="h-32 w-32 rounded-full border overflow-hidden shadow-sm">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar Preview" className="object-cover h-full w-full" />
                            ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">Chưa có ảnh</div>
                            )}
                        </div>
                        <input type="file" id="avatar" onChange={handleAvatarChange} className="hidden" accept="image/*" />
                        <button type="button" onClick={() => document.getElementById("avatar").click()} className="border border-black bg-black text-white px-4 py-2 text-sm hover:text-black hover:bg-white transition">
                            Chọn ảnh
                        </button>
                        <p className="text-xs text-gray-400 text-center max-w-[160px]">Dung lượng tối đa 2MB. JPG, PNG.</p>
                    </div>
                </form>
            </section>
        </div>
    );
}

/**
 * Input component - render input text có label
 *
 * @param {Object} props
 * @param {string} props.label - Nhãn input
 * @param {string} props.id - Id input
 * @param {string} props.value - Giá trị hiện tại
 * @param {function} props.onChange - Xử lý thay đổi
 * @param {boolean} [props.readOnly=false] - Chế độ chỉ đọc
 */

function Input({ label, id, value, onChange, readOnly = false }) {
    return (
        <div className="form-group">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
            <input
                id={id}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                className={` 
                    form-input 
                    ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
                `}
            />
        </div>
    );
}

/**
 * Select component - render dropdown select
 *
 * @param {Object} props
 * @param {Array<string|number>} props.options - Danh sách option
 * @param {string|number} props.value - Giá trị đang chọn
 * @param {function} props.onChange - Xử lý thay đổi
 */

function Select({ options, value, onChange }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className="form-input"
        >
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    );
}


export default Info;
