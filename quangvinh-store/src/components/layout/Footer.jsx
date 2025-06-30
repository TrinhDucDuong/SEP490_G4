import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard, faMoneyBill, faUniversity } from "@fortawesome/free-solid-svg-icons";

function Footer() {
    return (
        <footer className="bg-black text-white py-6 flex flex-row justify-around">
            <div className="flex flex-col">
                <div className="text-yellow-400 font-bold">
                    Hệ Thống Cửa Hàng
                </div>
                <address className="not-italic my-4">
                    Địa chỉ:
                    <div className="ml-4">
                        <ul className="list-disc list-inside">
                            <li>126 Quán Thánh, Ba Đình, Hà Nội</li>
                        </ul>
                    </div>
                    Hotline hỗ trợ:
                    <div className="ml-4 my-4">
                        <ul className="list-disc list-inside">
                            <li>Toàn quốc: 0877759999</li>
                            <li>Phản Án Chất Lượng Dịch Vụ: 0877759999</li>
                        </ul>
                    </div>
                    Email: <a href="mailto:support@quangvinstore.vn" className="text-blue-400">support@quangvinstore.vn</a>
                </address>
                <div className="mt-2 my-4 flex space-x-2 gap-4" aria-label="Mạng xã hội">
                    <div>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} className="text-blue-600 hover:text-blue-400" />
                        </a>
                    </div>
                    <div>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} className="text-pink-600 hover:text-pink-400" />
                        </a>
                    </div>
                    <div>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faYoutube} className="text-red-600 hover:text-red-400" />
                        </a>
                    </div>
                    <div>
                        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTiktok} className="text-white hover:text-gray-400" />
                        </a>
                    </div>
                </div>
            </div>
            <nav aria-label="Chính sách khách hàng">
                <div className="text-yellow-400 font-bold">
                    Chính Sách Cho Khách Hàng
                </div>
                <ul className="list-disc list-inside mt-2">
                    <li>Điều Khoản Sử Dụng/Term Of Service</li>
                    <li>Chính Sách Mua Hàng & Bảo Hành</li>
                    <li>Chính Sách Giao Hàng</li>
                    <li>Chính Sách Đổi Trả</li>
                    <li>Chính Sách Đổi Trả Dip Sale</li>
                    <li>Chính Sách Bảo Mật</li>
                    <li>Chính Sách Tích Điểm & Đổi Điểm Thưởng</li>
                </ul>
            </nav>
            <nav aria-label="Hướng dẫn khách hàng">
                <div className="text-yellow-400 font-bold">
                    Hướng Dẫn Cho Khách Hàng
                </div>
                <ul className="list-disc list-inside mt-2">
                    <li>Hướng Dẫn Đặt Đơn Hàng</li>
                    <li>Hướng Dẫn Đơn Hàng Chưa Thanh Toán</li>
                    <li>Hướng Dẫn Đơn Hàng Đã Thanh Toán</li>
                    <li>Hướng Dẫn Bảo Quản Sản Phẩm</li>
                    <li>Hướng Dẫn Thanh Toán</li>
                </ul>
                <div className="mt-2 flex space-x-2">
                    <div><FontAwesomeIcon icon={faUniversity} /></div>
                    <div><FontAwesomeIcon icon={faCreditCard} /></div>
                    <div><FontAwesomeIcon icon={faMoneyBill} /></div>
                </div>
            </nav>
        </footer>
    );
}

export default Footer;