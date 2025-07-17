import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard, faMoneyBill, faUniversity } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

import { useFetchPolicy } from "../../../hooks/Customer/useFetchPolicy.js";
import { useFetchInstruction } from "../../../hooks/Customer/useFetchInstruction.js";

function Footer() {
    const { policies, loading: loadingPolicy } = useFetchPolicy();
    const { instructions, loading: loadingInstruction } = useFetchInstruction();

    const featuredPolicies = policies.slice(0, 4);
    const featuredInstructions = instructions.slice(0, 3);

    return (
        <footer className="bg-black text-white pt-10 pb-6 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 border-b border-gray-700 pb-10">
                <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-yellow-400 font-bold text-lg">Hệ Thống Cửa Hàng</h2>
                    <address className="not-italic text-sm leading-relaxed space-y-2">
                        <div>
                            <span className="font-semibold">Địa chỉ:</span>
                            <ul className="ml-4 list-disc list-inside">
                                <li>126 Quán Thánh, Ba Đình, Hà Nội</li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-semibold">Hotline hỗ trợ:</span>
                            <ul className="ml-4 list-disc list-inside">
                                <li>Toàn quốc: 0877759999</li>
                                <li>Phản ánh dịch vụ: 0877759999</li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-semibold">Email:</span>{" "}
                            <a href="mailto:support@quangvinstore.vn" className="text-blue-400 hover:underline break-all">
                                support@quangvinstore.vn
                            </a>
                        </div>
                    </address>
                    <div className="flex justify-center md:justify-start gap-4 mt-2">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} className="text-2xl text-blue-600 hover:text-blue-400 transition" />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} className="text-2xl text-pink-600 hover:text-pink-400 transition" />
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faYoutube} className="text-2xl text-red-600 hover:text-red-400 transition" />
                        </a>
                        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTiktok} className="text-2xl text-white hover:text-gray-400 transition" />
                        </a>
                    </div>
                </div>

                <nav className="space-y-4 text-center md:text-left">
                    <h2 className="text-yellow-400 font-bold text-lg">Chính Sách Nổi Bật</h2>
                    {loadingPolicy ? (
                        <div className="text-sm text-gray-400">Đang tải chính sách...</div>
                    ) : (
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            {featuredPolicies.map((policy) => (
                                <li key={policy.policyId}>
                                    <Link
                                        to={`/policies/${policy.policyId}`}
                                        className="hover:underline hover:text-yellow-300 transition"
                                    >
                                        {policy.policyName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Link to="/policies" className="block mt-2 text-sm text-blue-400 hover:underline">
                        Xem tất cả chính sách
                    </Link>
                </nav>

                <nav className="space-y-4 text-center md:text-left">
                    <h2 className="text-yellow-400 font-bold text-lg">Hướng Dẫn Khách Hàng</h2>
                    {loadingInstruction ? (
                        <div className="text-sm text-gray-400">Đang tải hướng dẫn...</div>
                    ) : (
                        <ul className="text-sm space-y-2 list-disc list-inside">
                            {featuredInstructions.map((instruction) => (
                                <li key={instruction.instructionId}>
                                    <Link
                                        to={`/instructions/${instruction.instructionId}`}
                                        className="hover:underline hover:text-yellow-300 transition"
                                    >
                                        {instruction.instructionName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Link to="/instructions" className="block mt-2 text-sm text-blue-400 hover:underline">
                        Xem tất cả hướng dẫn
                    </Link>
                    <div className="flex justify-center md:justify-start gap-4 mt-2">
                        <FontAwesomeIcon icon={faUniversity} className="text-xl text-white" title="Chuyển khoản" />
                        <FontAwesomeIcon icon={faCreditCard} className="text-xl text-white" title="Thẻ tín dụng" />
                        <FontAwesomeIcon icon={faMoneyBill} className="text-xl text-white" title="Tiền mặt" />
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
