const Pagination = ({ currentPage, pageSize, totalItems, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalPages <= 1) return null;

    return (
        <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    className={`px-3 py-1 rounded ${i === currentPage ? 'bg-black text-white' : 'bg-white text-black border'}`}
                    onClick={() => onPageChange(i)}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
};

export default Pagination;