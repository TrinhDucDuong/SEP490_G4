import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle, AlertTriangle, Home } from 'lucide-react';
import { useAuthForManager } from '../../context/AuthContextForManager';
// Import logo
import logoImage from '../../assets/images/logo_white.png';

const LoginForManager = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, isAuthenticated, loading: authLoading } = useAuthForManager();
    const navigate = useNavigate();
    const location = useLocation();

    // Debug: Log auth state
    useEffect(() => {
        console.log('Auth state:', { isAuthenticated, authLoading });
    }, [isAuthenticated, authLoading]);

    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            console.log('User is authenticated, redirecting...');
            const from = location.state?.from?.pathname || '/admin/category-management';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, authLoading, navigate, location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', { username: formData.username });

            const result = await login(formData.username, formData.password, false);
            console.log('Login result:', result);

            // Manual redirect if needed
            const from = location.state?.from?.pathname || '/admin/category-management';
            console.log('Redirecting to:', from);
            navigate(from, { replace: true });

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Đang kiểm tra đăng nhập...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900 relative">
            {/* Professional Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="relative min-h-screen flex">
                {/* Left Side - Professional Warning Section */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full">
                        {/* Logo Section - Logo to đùng */}
                        <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
                            <img
                                src={logoImage}
                                alt="Quang Vinh Authentic"
                                className="mx-auto h-56 w-auto object-contain filter drop-shadow-2xl"
                            />
                        </div>

                        {/* Enhanced Warning Box với nội dung đầy đủ */}
                        <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-200">
                            {/* Warning Header */}
                            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                                <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-lg mr-4">
                                    <AlertTriangle className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-red-600">Cảnh báo!</h3>
                                    <p className="text-gray-600 font-medium">Hệ thống bảo mật cao</p>
                                </div>
                            </div>

                            {/* Warning Content - Đầy đủ theo yêu cầu */}
                            <div className="space-y-4 text-sm leading-relaxed">
                                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                    <p className="font-bold text-red-800 text-base">
                                        Vui lòng thoát ra nếu bạn không phải nhân viên cửa hàng Quang Vinh Authentic.
                                        Mọi hành động xấu của bạn đều sẽ bị ghi lại và phải chịu trách nhiệm trước pháp luật!
                                    </p>
                                </div>

                                <div className="space-y-3 text-gray-700">
                                    <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        Hệ thống này chỉ dành cho người được ủy quyền. Mọi truy cập trái phép sẽ bị xử lý theo quy định của pháp luật.
                                    </p>

                                    <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        Mọi hành vi xâm nhập trái phép đều bị ghi lại và có thể bị truy cứu trách nhiệm hình sự theo <strong className="text-red-600">Điều 289 Bộ luật Hình sự Việt Nam.</strong>
                                    </p>

                                    <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        Lợi dụng tài khoản của người khác hoặc can thiệp vào hệ thống có thể bị <strong className="text-red-600">phạt tù lên đến 7 năm</strong> theo pháp luật hiện hành.
                                    </p>

                                    <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        Dữ liệu hệ thống được bảo vệ theo luật an ninh mạng. Truy cập trái phép hoặc phá hoại dữ liệu sẽ bị xử lý theo <strong className="text-red-600">Bộ luật Hình sự (2017), điều 289 - 290.</strong>
                                    </p>
                                </div>

                                {/* Customer Redirect */}
                                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                    <div className="flex items-start">
                                        <Home className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-green-700 text-sm mb-3">
                                                Nếu bạn muốn mua hàng nhưng vô tình đi lạc, vui lòng quay trở lại trang chủ để tiếp tục trải nghiệm và nhận vô vàn ưu đãi.
                                            </p>
                                            <Link
                                                to="/"
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Home className="w-4 h-4 mr-2" />
                                                Quay về trang chủ
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Professional Login Form */}
                <div className="flex-1 flex items-center justify-center p-8 bg-white">
                    <div className="max-w-md w-full">
                        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
                            {/* Form Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập chỉ dành cho nhân viên của Quang Vinh Authentic</h2>
                                <p className="text-gray-600">Truy Cập Hệ Thống Quản Lý</p>
                                <div className="w-12 h-1 bg-slate-800 mx-auto mt-3 rounded"></div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                                    <span className="text-red-700 text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Debug Info - Remove in production */}
                            {/* eslint-disable-next-line no-undef */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-700">
                                        Debug: isAuthenticated={String(isAuthenticated)}, authLoading={String(authLoading)}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tên Tài Khoản
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-base bg-white"
                                            placeholder="Nhập tài khoản của bạn"
                                            disabled={loading}
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mật Khẩu
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors text-base bg-white"
                                            placeholder="Nhập mật khẩu của bạn"
                                            disabled={loading}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                            Đang xác thực...
                                        </div>
                                    ) : (
                                        'Đăng nhập'
                                    )}
                                </button>
                            </form>

                            {/* Account Information Section */}
                            <div className="mt-8 space-y-4">
                                {/* Bạn chưa có tài khoản? */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 font-medium">Bạn chưa có tài khoản?</p>
                                </div>

                                {/* Staff Information */}
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="flex items-start">
                                        <User className="w-5 h-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Dành cho nhân viên</h4>
                                            <p className="text-xs text-slate-700 leading-relaxed">
                                                Nếu là nhân viên nhưng chưa được cấp tài khoản, vui lòng liên hệ lại quản lý của bạn để xác nhận thông tin và nhận tài khoản. Khi yêu cầu cấp tài khoản, vui lòng mang theo CCCD và xác minh số điện thoại.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500">
                                    © 2024 Quang Vinh Authentic. Tất cả quyền được bảo lưu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForManager;
