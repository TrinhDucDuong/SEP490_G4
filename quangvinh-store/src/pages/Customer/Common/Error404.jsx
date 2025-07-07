import React from 'react';
import { Link } from 'react-router-dom';
import logo404 from '../../../assets/images/404.jpg';

const Error404 = () => {
    return (
        <div className="flex mx-20 flex-row justify-between items-center min-h-screen px-6  dark:bg-gray-900 text-center">
            <div className="mb-6 flex flex-col items-start justify-center">
                <h1 className="text-6xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
                    Ối không...
                </h1>
                <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
                    Trang không tồn tại
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng quay về trang chủ để tiếp tục khám phá.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 text-white bg-black hover:bg-white hover:text-black rounded-full shadow-md transition"
                >
                    ← Quay lại Trang chủ
                </Link>
            </div>
            <div className="max-w-[640px]">
                <img src= {logo404} alt="404 error" />
            </div>

        </div>
    );
};

export default Error404;
