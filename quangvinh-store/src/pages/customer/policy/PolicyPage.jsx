/**
 * @file PolicyPage.jsx
 * @description Trang hiển thị danh sách và chi tiết các chính sách (Policy Page).
 * Người dùng có thể chọn từng policy từ danh sách bên trái để xem chi tiết bên phải.
 * @author ngothangwork
 * @copyright 2025
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchPolicy } from "../../../hooks/customer/useFetchPolicy.js";
import Breadcrumb from "../../../components/common/customer/Breadcrumb.jsx";

/**
 * PolicyPage Component
 *
 * - Lấy danh sách policies từ hook `useFetchPolicy`.
 * - Hiển thị danh sách policies bên trái, chi tiết policy được chọn bên phải.
 * - Cho phép điều hướng (navigate) giữa các policy qua `react-router-dom`.
 *
 * @component
 * @returns {JSX.Element} Giao diện trang Policy
 */
const PolicyPage = () => {
    const { policies, loading, error } = useFetchPolicy();
    const { id } = useParams();
    const navigate = useNavigate();

    /** @state {number|null} selectedId - Id của policy được chọn */
    const [selectedId, setSelectedId] = useState(parseInt(id) || null);

    /**
     * Cập nhật `selectedId` khi URL param `id` thay đổi.
     */
    useEffect(() => {
        if (id) setSelectedId(parseInt(id));
    }, [id]);

    /**
     * Scroll lên đầu trang khi thay đổi `selectedId`.
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedId]);

    /**
     * Xử lý khi chọn 1 policy từ danh sách.
     *
     * @param {number} id - Id của policy được chọn
     */
    const handleSelect = (id) => {
        setSelectedId(id);
        navigate(`/policies/${id}`);
    };

    /** @type {object|undefined} selectedPolicy - Policy đang được chọn */
    const selectedPolicy = policies.find(p => p.policyId === selectedId);

    if (loading) return <div className="text-center py-12 text-gray-600 text-lg">Loading policies...</div>;
    if (error) return <div className="text-center py-12 text-red-500 text-lg">{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-10 text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Home', to: '/' },
                        { label: 'Policies', to: '/policies' },
                        selectedPolicy && { label: selectedPolicy.policyName }
                    ].filter(Boolean)}
                    className="mb-8 text-gray-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 bg-white shadow-sm rounded-lg overflow-hidden">
                    {/* Sidebar - Danh sách policies */}
                    <aside className="md:col-span-1 p-6 border-r border-gray-100">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Policy List</h2>
                        <ul className="space-y-2">
                            {policies.map((policy) => (
                                <li key={policy.policyId}>
                                    <button
                                        onClick={() => handleSelect(policy.policyId)}
                                        className={`w-full text-left py-2.5 px-4 rounded-md transition-colors duration-200 ${
                                            selectedId === policy.policyId
                                                ? 'bg-gray-50 text-gray-600 font-medium'
                                                : 'text-black hover:bg-gray-50 hover:text-gray-800'
                                        }`}
                                    >
                                        {policy.policyName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Main Content - Chi tiết policy */}
                    <section className="md:col-span-3 p-8 bg-white min-h-[400px]">
                        {selectedPolicy ? (
                            <>
                                <h1 className="text-3xl font-extrabold mb-5 text-gray-900 leading-tight">
                                    {selectedPolicy.policyName}
                                </h1>
                                <div
                                    className="leading-relaxed text-gray-700 text-lg ck-content"
                                    dangerouslySetInnerHTML={{ __html: selectedPolicy.policyDescription }}
                                />
                            </>
                        ) : (
                            <p className="text-gray-500 text-lg py-12 text-center">
                                Select a policy to view its details.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;
