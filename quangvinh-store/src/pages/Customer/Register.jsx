import loginBg from "../../assets/images/login-background.jpg";
import { GoogleLogin } from '@react-oauth/google';

function Register() {
    return (
        <>
            <div className="bg-cover bg-center flex justify-center items-center min-h-screen" style={{ backgroundImage: `url(${loginBg})` }}>
                <div className="max-w-screen-sm w-full mx-4 bg-white rounded-xl shadow-lg p-16 text-center">
                    <h2 className="text-2xl font-semibold mb-8">ĐĂNG KÝ</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Họ" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required/>
                        <input type="text" placeholder="Tên" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required/>
                        <input type="email" placeholder="Email" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required/>
                        <input type="tel" placeholder="Số điện thoại" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required/>
                        <input type="password" placeholder="Mật khẩu" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required/>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>
                                Đã có tài khoản?{" "}
                                <a href="/src/pages/Customer/Login" className="text-black hover:underline">
                                    Đăng nhập
                                </a>
                            </span>
                            <a href="/public" className="text-black hover:underline">
                                Quay lại cửa hàng
                            </a>
                        </div>
                        <button type="submit" className="w-[60%] bg-black text-white p-4 mt-8 rounded-md hover:bg-gray-800 transition">
                            Đăng Ký
                        </button>
                        <div className="mt-4 w-[60%] bg-white mx-auto rounded-xl shadow-md hover:bg-gray-100 focus:outline-none transition">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    console.log("Google Register Success:", credentialResponse);
                                }}
                                onError={() => {
                                    console.log("Google Register Failed");
                                }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;