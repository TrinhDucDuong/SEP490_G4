import React, { useState, useContext } from "react";
import loginBg from "../../assets/images/login-background.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../../context/AuthContext.jsx";

function Login() {
    const { login } = useContext(AuthContext);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:9999/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: identifier,
                    password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Phản hồi từ API /auth/login:", data);
                console.log("Thông tin tài khoản:", data.account);
                console.log("Token:", data.token);
                localStorage.setItem("token", data.token);
                login(data.account);
                console.log("Dữ liệu localStorage sau khi đăng nhập:", {
                    user: localStorage.getItem("user"),
                    token: localStorage.getItem("token"),
                }); // In dữ liệu localStorage
                window.location.href = "/";
            } else {
                const errData = await response.json();
                console.error("Lỗi đăng nhập:", errData);
                setError(errData.message || "Đăng nhập thất bại");
            }
        } catch (err) {
            console.error("Lỗi mạng:", err);
            setError("Lỗi kết nối với máy chủ!");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await fetch("http://localhost:9999/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: credentialResponse.credential,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Phản hồi Google Login:", data);
                console.log("Thông tin tài khoản:", data.account);
                console.log("Token:", data.token);
                localStorage.setItem("token", data.token);
                login(data.account);
                console.log("Dữ liệu localStorage sau Google Login:", {
                    user: localStorage.getItem("user"),
                    token: localStorage.getItem("token"),
                });
                window.location.href = "/";
            } else {
                const errData = await res.json();
                console.error("Lỗi Google Login:", errData);
                setError(errData.message || "Đăng nhập Google thất bại");
            }
        } catch (err) {
            console.error("Lỗi mạng Google Login:", err);
            setError("Không thể kết nối với máy chủ Google.");
        }
    };

    return (
        <>
            <div
                className="bg-cover bg-center flex justify-center items-center min-h-screen"
                style={{ backgroundImage: `url(${loginBg})` }}
            >
                <div className="max-w-screen-sm w-full mx-4 bg-white rounded-xl shadow-lg p-16 text-center">
                    <h2 className="text-2xl font-semibold mb-8">ĐĂNG NHẬP</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Email / SĐT / Username"
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>
                                Bạn chưa có tài khoản?{" "}
                                <a href="/src/pages/Customer/Register" className="text-black hover:underline">
                                    Đăng ký
                                </a>
                            </span>
                            <a href="/forgot-password" className="text-black hover:underline">
                                Quên mật khẩu?
                            </a>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            className="w-[60%] bg-black text-white p-4 mt-6 rounded-md hover:bg-gray-800 transition"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                        </button>
                    </form>

                    <div className="mt-6 w-[60%] mx-auto">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => {
                                console.error("Google Login thất bại");
                                setError("Đăng nhập Google thất bại");
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;