import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
            <h1 className="text-6xl font-bold text-black mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-6">Không tìm thấy trang bạn yêu cầu.</p>
            <Link
                to="/"
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
            >
                Quay về trang chủ
            </Link>
        </div>
    );
}

export default NotFound;