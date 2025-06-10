import HeaderNoHover from "../components/layout/HeaderNoHover.jsx";
import loginBg from "../assets/images/login-background.jpg";
import { GoogleLogin } from '@react-oauth/google';


function Login() {
    return (
        <>
            <HeaderNoHover />
            <div className="bg-cover bg-center flex justify-center items-center min-h-screen" style={{ backgroundImage: `url(${loginBg})` }}>
                <div className="max-w-screen-sm w-full mx-4 bg-white rounded-xl shadow-lg p-16 text-center">
                    <h2 className="text-2xl font-semibold mb-8">ĐĂNG NHẬP</h2>
                    <form className="space-y-4">
                        <input type="email" placeholder="Email" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required/>
                        <input type="password" placeholder="Mật khẩu" className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required/>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>
                                Bạn chưa có tài khoản?{" "}
                                <a href="/register" className="text-black hover:underline">Đăng ký</a>
                            </span>
                            <a href="/forgot-password" className="text-black hover:underline">Quên mật khẩu?</a>
                        </div>
                        <button type="submit" className="w-[60%] bg-black text-white p-4 mt-8 rounded-md hover:bg-gray-800 transition">
                            Đăng Nhập
                        </button>

                        <div className="mt-4 w-[60%] bg-white mx-auto rounded-xl shadow-md hover:bg-gray-100 focus:outline-none transition">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    console.log("Google Login Success:", credentialResponse);
                                }}
                                onError={() => {
                                    console.log("Google Login Failed");
                                }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;