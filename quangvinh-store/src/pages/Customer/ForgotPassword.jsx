import React, { useState } from "react";
import HeaderNoHover from "../../components/layout/HeaderNoHover.jsx";
import loginBg from "../../assets/images/login-background.jpg";

function ForgotPassword() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("http://localhost:9999/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: emailOrUsername }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Forgot Password Response:", data);
                setMessage("Vui lòng kiểm tra email để đặt lại mật khẩu.");
            } else {
                const errData = await response.json();
                console.error("Lỗi gửi yêu cầu quên mật khẩu:", errData);
                setError(errData.message || "Gửi yêu cầu thất bại.");
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            setError("Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className="bg-cover bg-center flex justify-center items-center min-h-screen"
                style={{ backgroundImage: `url(${loginBg})` }}
            >
                <div className="max-w-screen-sm w-full mx-4 bg-white rounded-xl shadow-lg p-16 text-center">
                    <h2 className="text-2xl font-semibold mb-8">QUÊN MẬT KHẨU</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Email hoặc tên đăng nhập"
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                        />

                        {message && (
                            <div className="text-green-600 text-sm">{message}</div>
                        )}
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            className="w-[60%] bg-black text-white p-4 mt-4 rounded-md hover:bg-gray-800 transition"
                            disabled={loading}
                        >
                            {loading ? "Đang gửi yêu cầu..." : "Gửi Yêu Cầu"}
                        </button>
                    </form>

                    <div className="mt-4 text-sm">
                        <a href="/src/pages/Customer/Login" className="text-black hover:underline">
                            ← Quay lại trang đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
