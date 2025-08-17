import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo_black.png";

function ForgotPassword() {
    const [contact, setContact] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if (!contact) {
            setError("Vui lòng nhập email hoặc số điện thoại.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/auth/social/forgot?contact=${encodeURIComponent(contact)}`,
                {
                    method: "GET",
                    headers: { "Accept": "*/*" },
                }
            );

            const data = await response.json();
            if (response.ok) {
                setMessage("Yêu cầu đã được gửi. Vui lòng kiểm tra email hoặc số điện thoại.");
            } else {
                setError(data.message || "Gửi yêu cầu thất bại.");
            }
        } catch (err) {
            setError("Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-center my-20 bg-white">
                {/* FORM FORGOT PASSWORD */}
                <div className="md:w-1/2 mr-24 space-y-6 md:space-y-8 max-w-md w-full h-full">
                    <h1 className="text-4xl font-sans text-black font-extrabold">
                        QUÊN MẬT KHẨU?<br />
                        <span className="text-[#594AE2]">KHÔNG SAO CẢ!</span>
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            className="rounded-full border border-gray-300 px-4 py-2 w-full"
                            type="text"
                            placeholder="Email hoặc số điện thoại"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />

                        {message && <p className="text-green-600 bg-green-100 rounded-full px-4 py-2 text-sm">{message}</p>}
                        {error && <p className="text-white bg-red-500 rounded-full px-4 py-2 text-sm">{error}</p>}

                        <button
                            className="w-full bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                            disabled={loading}
                        >
                            {loading ? "Đang gửi yêu cầu..." : "Gửi Yêu Cầu"}
                        </button>

                        <div className="text-sm mt-4 text-center">
                            <Link to="/login" className="text-blue-600 hover:underline">
                                ← Quay lại trang đăng nhập
                            </Link>
                        </div>
                    </form>

                    <div className="mt-4 text-xs text-gray-600 leading-snug">
                        <p>
                            Bằng cách nhấn 'Gửi yêu cầu', bạn đồng ý với <span className="underline cursor-pointer">Chính sách Bảo mật</span> của WebName,
                            <span className="underline cursor-pointer"> Điều khoản thành viên</span> và
                            <span className="underline cursor-pointer"> Điều khoản trang Web</span>.
                        </p>
                    </div>
                </div>

                {/* BÊN PHẢI: LỢI ÍCH */}
                <div className="md:w-1/2 ml-24 bg-gray-200 shadow-md p-6 rounded-xl mt-10 md:mt-0 md:ml-10 max-w-md w-full h-full">
                    <h2 className="text-3xl font-bold mb-6">Lấy lại quyền truy cập ngay!</h2>
                    <p className="mb-6 text-lg font-semibold text-black">Chúng tôi sẽ giúp bạn khôi phục tài khoản.</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 mb-6 space-y-1">
                        <li>Gửi mã xác thực nhanh chóng</li>
                        <li>Không mất dữ liệu tài khoản</li>
                        <li>Khôi phục trong vài bước</li>
                        <li>Hỗ trợ 24/7 nếu gặp vấn đề</li>
                    </ul>
                    <p className="text-sm text-gray-600 mb-6">
                        Nếu bạn vẫn gặp vấn đề, hãy liên hệ đội hỗ trợ để được trợ giúp nhanh chóng!
                    </p>
                    <Link to="/register" className="text-blue-600 hover:underline">
                        <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition w-full">
                            Đăng ký tài khoản mới
                        </button>
                    </Link>
                </div>
            </div>

            <div className="bg-[#594AE2] p-4 rounded-t-3xl flex items-center justify-between flex-col md:flex-row gap-4">
                <div className="text-white">
                    <h1 className="text-2xl font-bold">Quay lại với QUANG VINH</h1>
                    <p className="text-lg">Đăng ký nhận ưu đãi 15%</p>
                    <p className="text-sm">Chỉ cần nhập email của bạn!</p>
                    <div className="mt-4 flex space-x-4">
                        <input type="email" placeholder="Email của bạn" className="p-2 rounded-lg text-black" />
                        <button className="p-2 rounded-lg bg-black border-black text-white hover:bg-white hover:text-black transition">
                            Đăng ký ngay
                        </button>
                    </div>
                </div>

                <div className="flex flex-col w-48 items-end">
                    <Link to="/" className="block w-full h-full">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-full h-full object-contain"
                            draggable={false}
                        />
                    </Link>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
