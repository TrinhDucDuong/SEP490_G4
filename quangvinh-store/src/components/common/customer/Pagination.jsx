const Pagination = ({ currentPage, pageSize, totalItems, onPageChange }) => {
    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / pageSize);

    // Nếu chỉ có 1 trang hoặc ít hơn, không hiển thị pagination
    if (totalPages <= 1) return null;

    return (
        <div className="flex space-x-2">
            {/* Tạo các nút cho từng trang */}
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                        i === currentPage
                            ? 'bg-black text-white' // Trang hiện tại: nền đen chữ trắng
                            : 'bg-white text-black border' // Các trang khác: nền trắng, viền đen
                    }`}
                    onClick={() => onPageChange(i)} // Khi click gọi callback với index trang
                >
                    {i + 1} {/* Hiển thị số trang (bắt đầu từ 1) */}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
