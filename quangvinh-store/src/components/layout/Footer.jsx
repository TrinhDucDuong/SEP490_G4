import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard, faMoneyBill, faUniversity } from "@fortawesome/free-solid-svg-icons";

function Footer() {
    return (
        <footer className="bg-black text-white pt-8 pb-4 px-2 sm:px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                {/* Cột 1: Hệ thống cửa hàng */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="text-yellow-400 font-bold mb-4 text-lg">Hệ Thống Cửa Hàng</div>
                    <address className="not-italic text-sm leading-relaxed mb-4">
                        <div className="mb-2">
                            <span className="font-semibold">Địa chỉ:</span>
                            <ul className="ml-4 list-disc list-inside">
                                <li>126 Quán Thánh, Ba Đình, Hà Nội</li>
                            </ul>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Hotline hỗ trợ:</span>
                            <ul className="ml-4 list-disc list-inside">
                                <li>Toàn quốc: 0877759999</li>
                                <li>Phản Án Chất Lượng Dịch Vụ: 0877759999</li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-semibold">Email:</span>{" "}
                            <a href="mailto:support@quangvinstore.vn" className="text-blue-400 hover:underline break-all">
                                support@quangvinstore.vn
                            </a>
                        </div>
                    </address>
                    <div className="flex gap-4 mt-4 justify-center" aria-label="Mạng xã hội">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FontAwesomeIcon icon={faFacebook} className="text-xl sm:text-2xl text-blue-600 hover:text-blue-400 transition" />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FontAwesomeIcon icon={faInstagram} className="text-xl sm:text-2xl text-pink-600 hover:text-pink-400 transition" />
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <FontAwesomeIcon icon={faYoutube} className="text-xl sm:text-2xl text-red-600 hover:text-red-400 transition" />
                        </a>
                        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <FontAwesomeIcon icon={faTiktok} className="text-xl sm:text-2xl text-white hover:text-gray-400 transition" />
                        </a>
                    </div>
                </div>
                {/* Cột 2: Chính sách */}
                <nav aria-label="Chính sách khách hàng" className="mt-8 sm:mt-0 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="text-yellow-400 font-bold mb-4 text-lg">Chính Sách Cho Khách Hàng</div>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Điều Khoản Sử Dụng/Term Of Service</li>
                        <li>Chính Sách Mua Hàng & Bảo Hành</li>
                        <li>Chính Sách Giao Hàng</li>
                        <li>Chính Sách Đổi Trả</li>
                        <li>Chính Sách Đổi Trả Dip Sale</li>
                        <li>Chính Sách Bảo Mật</li>
                        <li>Chính Sách Tích Điểm & Đổi Điểm Thưởng</li>
                    </ul>
                </nav>
                {/* Cột 3: Hướng dẫn */}
                <nav aria-label="Hướng dẫn khách hàng" className="mt-8 sm:mt-0 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="text-yellow-400 font-bold mb-4 text-lg">Hướng Dẫn Cho Khách Hàng</div>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Hướng Dẫn Đặt Đơn Hàng</li>
                        <li>Hướng Dẫn Đơn Hàng Chưa Thanh Toán</li>
                        <li>Hướng Dẫn Đơn Hàng Đã Thanh Toán</li>
                        <li>Hướng Dẫn Bảo Quản Sản Phẩm</li>
                        <li>Hướng Dẫn Thanh Toán</li>
                    </ul>
                    <div className="flex gap-4 mt-4 justify-center">
                        <FontAwesomeIcon icon={faUniversity} className="text-lg sm:text-xl text-white" title="Chuyển khoản ngân hàng" />
                        <FontAwesomeIcon icon={faCreditCard} className="text-lg sm:text-xl text-white" title="Thẻ tín dụng" />
                        <FontAwesomeIcon icon={faMoneyBill} className="text-lg sm:text-xl text-white" title="Tiền mặt" />
                    </div>
                </nav>
            </div>
            <div className="max-w-7xl mx-auto text-center text-xs text-gray-400 pt-6">
                © {new Date().getFullYear()} Quang Vinh Store. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;