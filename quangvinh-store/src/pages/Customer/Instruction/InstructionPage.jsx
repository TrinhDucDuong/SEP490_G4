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
        <div className="bg-gray-50 min-h-screen py-10 text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Home', to: '/' },
                        { label: 'Instructions', to: '/instructions' },
                        selectedInstruction && { label: selectedInstruction.instructionName }
                    ].filter(Boolean)}
                    className="mb-8 text-gray-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 bg-white shadow-sm rounded-lg overflow-hidden">
                    {/* Sidebar */}
                    <aside className="md:col-span-1 p-6 border-r border-gray-100">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Instruction List</h2>
                        <ul className="space-y-2">
                            {instructions.map((item) => (
                                <li key={item.instructionId}>
                                    <button
                                        onClick={() => handleSelect(item.instructionId)}
                                        className={`w-full text-left py-2.5 px-4 rounded-md transition-colors duration-200 ${
                                            selectedId === item.instructionId
                                                ? 'bg-gray-50 text-gray-600 font-medium'
                                                : 'text-black hover:bg-gray-50 hover:text-gray-800'
                                        }`}
                                    >
                                        {item.instructionName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Content */}
                    <section className="md:col-span-3 p-8 bg-white min-h-[400px]">
                        {selectedInstruction ? (
                            <>
                                <h1 className="text-3xl font-extrabold mb-5 text-gray-900 leading-tight">
                                    {selectedInstruction.instructionName}
                                </h1>
                                <div className="leading-relaxed text-gray-700 text-lg whitespace-pre-line">
                                    {selectedInstruction.instructionDescription}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-lg py-12 text-center">
                                Select an instruction to view its details.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default InstructionPage;
