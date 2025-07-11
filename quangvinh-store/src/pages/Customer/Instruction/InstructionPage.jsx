import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchInstruction } from "../../../hooks/Customer/useFetchInstruction.js";
import Breadcrumb from "../../../components/common/Customer/Breadcrumb.jsx";

const InstructionPage = () => {
    const { instructions, loading, error } = useFetchInstruction();
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
        navigate(`/instructions/${id}`);
    };

    const selectedInstruction = instructions.find(i => i.instructionId === selectedId);

    if (loading) return <div className="text-center py-12 text-gray-600 text-lg">Loading instructions...</div>;
    if (error) return <div className="text-center py-12 text-red-500 text-lg">{error}</div>;

    return (
        <div className="bg-white min-h-screen py-8 text-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Home', to: '/' },
                        { label: 'Instructions', to: '/instructions' },
                        selectedInstruction && { label: selectedInstruction.instructionName }
                    ].filter(Boolean)}
                    className="mb-6 text-gray-600"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="md:col-span-1">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 tracking-tight">Instruction List</h2>
                        <ul className="space-y-3">
                            {instructions.map((item) => (
                                <li key={item.instructionId}>
                                    <button
                                        onClick={() => handleSelect(item.instructionId)}
                                        className={`w-full text-left py-2 px-4 rounded-lg transition-all duration-200 ${
                                            selectedId === item.instructionId
                                                ? 'bg-gray-200 text-gray-900 font-medium shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        {item.instructionName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Content */}
                    <section className="md:col-span-3 bg-gray-50 rounded-xl p-8 shadow-lg min-h-[400px]">
                        {selectedInstruction ? (
                            <>
                                <h1 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
                                    {selectedInstruction.instructionName}
                                </h1>
                                <p className="whitespace-pre-line leading-relaxed text-gray-800 text-lg">
                                    {selectedInstruction.instructionDescription}
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-600 text-lg">Please select an instruction from the list.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default InstructionPage;