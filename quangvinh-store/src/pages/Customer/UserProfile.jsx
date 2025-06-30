import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetchUser } from '../../hooks/useFetchUsers.js';
import SidebarProfile from "./Common/SidebarProfile.jsx";

function UserProfile() {
  const { user, token, login } = useFetchUser();
  console.log(user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dob: { year: '2000', month: '01', day: '01' },
    avatar: null,
    avatarUrl: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      const [year, month, day] = user.dob?.split('-') || ['2000', '01', '01'];
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        dob: { year, month, day },
        avatar: null,
        avatarUrl: user.avatarUrl || null,
      });
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  useEffect(() => {
    if (formData.avatar) {
      const url = URL.createObjectURL(formData.avatar);
      setAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.avatar]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDobChange = (part, value) => {
    setFormData((prev) => ({
      ...prev,
      dob: { ...prev.dob, [part]: value },
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { year, month, day } = formData.dob;
    const dateOfBirth = `${year}-${month}-${day}`;

    if (!formData.name) return alert('Vui lòng nhập họ và tên');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return alert('Email không hợp lệ');
    if (!/^\d{10}$/.test(formData.phoneNumber)) return alert('Số điện thoại phải có 10 chữ số');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('dob', dateOfBirth);
    if (formData.avatar) {
      formDataToSend.append('avatar', formData.avatar);
    }

    try {
      const res = await fetch('http://localhost:9999/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (res.ok) {
        const updatedUser = await res.json();
        if (typeof login === 'function') login(updatedUser, token);
        alert('Cập nhật thông tin thành công!');
      } else {
        alert('Cập nhật thất bại!');
      }
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
  };

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const breadcrumbItems = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Tài Khoản', to: '/profile' },
  ];

  return (
      <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-20">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-10 flex flex-col lg:flex-row gap-8">
          <SidebarProfile />
          <section className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-1">Hồ sơ của tôi</h2>
            <p className="text-gray-500 mb-6">Cập nhật thông tin cá nhân</p>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-5">
                <Input
                    label="Họ và tên"
                    id="name"
                    value={formData.name}
                    placeholder="Nhập họ và tên"
                    onChange={(e) => handleChange('name', e.target.value)}
                />
                <Input
                    label="Email"
                    id="email"
                    value={formData.email}
                    placeholder="Nhập email"
                    onChange={(e) => handleChange('email', e.target.value)}
                />
                <Input
                    label="Số điện thoại"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    placeholder="Nhập số điện thoại"
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                />

                <div>
                  <label className="block mb-1 font-medium">Giới tính</label>
                  <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full border-gray-300 rounded-lg py-2 px-4 bg-white focus:ring-2 focus:ring-black"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Ngày sinh</label>
                  <div className="flex gap-2">
                    <Select options={years} value={formData.dob.year} onChange={(e) => handleDobChange('year', e.target.value)} />
                    <Select options={months} value={formData.dob.month} onChange={(e) => handleDobChange('month', e.target.value)} />
                    <Select options={days} value={formData.dob.day} onChange={(e) => handleDobChange('day', e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="mt-6 bg-black text-white w-full md:w-36 rounded-full py-2 font-semibold hover:bg-gray-900 transition">
                  Lưu
                </button>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 rounded-full border border-gray-300 overflow-hidden">
                  {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar Preview" className="object-cover h-full w-full" />
                  ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Chưa có ảnh</div>
                  )}
                </div>
                <input type="file" id="avatar" onChange={handleAvatarChange} className="hidden" />
                <button type="button" onClick={() => document.getElementById('avatar').click()} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition text-sm">
                  Chọn ảnh
                </button>
                <p className="text-xs text-gray-400 text-center max-w-[160px]">Dung lượng tối đa 2MB. JPG, PNG.</p>
              </div>
            </form>
          </section>
        </div>
      </div>
  );
}

function Input({ label, id, value, onChange, placeholder = '', readOnly = false }) {
  return (
      <div>
        <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
        <input
            id={id}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            placeholder={placeholder}
            className={`w-full border border-gray-300 rounded-lg py-2 px-4 ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-white focus:ring-2 focus:ring-black'}`}
        />
      </div>
  );
}

function Select({ options, value, onChange }) {
  return (
      <select value={value} onChange={onChange} className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-black">
        {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
        ))}
      </select>
  );
}

export default UserProfile;
