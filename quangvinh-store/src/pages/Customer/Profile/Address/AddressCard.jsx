function AddressCard({ item, onEdit, onSetMain, onDelete, readonly = false }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 rounded-lg p-2 bg-white transition-shadow duration-300 hover:shadow-md">
            <div className="flex-1 mb-3 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-base text-gray-800">{item.name}</span>
                    {item.isMain && (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Mặc định
                        </span>
                    )}
                </div>

                <div className="text-sm text-gray-600 space-y-0.5">
                    <p>
                        <span className="font-medium text-gray-700">SĐT:</span> {item.phoneNumber}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">Địa chỉ:</span> {item.exactAddress}, {item.address}
                    </p>
                    <p className="text-gray-500 capitalize italic pt-1">
                        {item.type}
                    </p>
                </div>

                {!readonly && !item.isMain && (
                    <button
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 mt-2 inline-flex items-center gap-1"
                        onClick={onSetMain}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7 9.586 5.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Đặt làm mặc định
                    </button>
                )}
            </div>

            {!readonly && (
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto sm:pl-4">
                    <button
                        className="text-sm font-medium border p-2 px-4 rounded-full border-blue-600 text-blue-600 hover:text-white hover:bg-blue-700 whitespace-nowrap"
                        onClick={onEdit}
                    >
                        Chỉnh sửa
                    </button>
                    <button
                        className="text-sm font-medium border p-2 px-4 rounded-full border-red-500 text-red-500 hover:text-white hover:bg-red-700 whitespace-nowrap"
                        onClick={onDelete}
                    >
                        Xóa
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddressCard;