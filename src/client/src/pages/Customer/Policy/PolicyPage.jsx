import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchPolicy } from "../../../hooks/Customer/useFetchPolicy.js";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";

const PolicyPage = () => {
    const { policies, loading, error } = useFetchPolicy();
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedId, setSelectedId] = useState(parseInt(id) || null);

    useEffect(() => {
        if (id) setSelectedId(parseInt(id));
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedId]);

    const handleSelect = (id) => {
        setSelectedId(id);
        navigate(`/policies/${id}`);
    };

    const selectedPolicy = policies.find(p => p.policyId === selectedId);

    if (loading) return <div className="text-center py-12 text-gray-600 text-lg">Loading policies...</div>;
    if (error) return <div className="text-center py-12 text-red-500 text-lg">{error}</div>;

    return (
        <div className="bg-white min-h-screen py-8 text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Home', to: '/' },
                        { label: 'Policies', to: '/policies' },
                        selectedPolicy && { label: selectedPolicy.policyName }
                    ].filter(Boolean)}
                    className="mb-6 text-gray-600"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-1">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">Policy List</h2>
                        <ul className="space-y-3">
                            {policies.map((policy) => (
                                <li key={policy.policyId}>
                                    <button
                                        onClick={() => handleSelect(policy.policyId)}
                                        className={`w-full text-left py-2 px-4 rounded-lg transition-all duration-200 ${
                                            selectedId === policy.policyId
                                                ? 'bg-gray-200 text-gray-900 font-medium shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        {policy.policyName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Content */}
                    <section className="md:col-span-3 bg-gray-50 rounded-xl p-8 shadow-lg min-h-[400px]">
                        {selectedPolicy ? (
                            <>
                                <h1 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
                                    {selectedPolicy.policyName}
                                </h1>
                                <p className="whitespace-pre-line leading-relaxed text-gray-800 text-lg">
                                    {selectedPolicy.policyDescription}
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-600 text-lg">Please select a policy from the list.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;