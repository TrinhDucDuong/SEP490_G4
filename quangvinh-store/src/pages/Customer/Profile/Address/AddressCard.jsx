function AddressCard({ item, onEdit, onSetMain, onDelete }) {
    return (
        <div className="flex flex-row border rounded-xl p-4 shadow-sm bg-gray-50 justify-between">
            <div className="flex flex-col gap-1 flex-1">
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-sm text-gray-600">{item.phoneNumber}</div>
                <div className="text-sm">{item.address}</div>
                <div className="text-sm text-gray-500">{item.exactAddress}</div>
                <div className="flex flex-row gap-2 text-xs mt-2">
                    {item.isMain && (
                        <span className="text-green-600 px-3 py-1 rounded-full bg-green-200 font-semibold">
                            Địa chỉ chính
                        </span>
                    )}
                    <span className="text-gray-500 px-3 py-1 rounded-full bg-gray-200 italic">
                        {item.type}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-2 items-end justify-end ml-4">
                <button
                    className="bg-black text-white border border-black px-3 py-1 rounded-full text-sm hover:bg-white hover:text-black transition"
                    onClick={onEdit}
                >
                    Cập nhật
                </button>
                {!item.isMain && (
                    <button
                        className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition"
                        onClick={onSetMain}
                    >
                        Đặt làm mặc định
                    </button>
                )}
                <button
                    className="text-red-600 bg-red-200 px-4 py-1 rounded-full text-sm  hover:bg-red-400 hover:text-red-800 transition"
                    onClick={onDelete}
                >
                    Xoá
                </button>
            </div>
        </div>
    );
}

export default AddressCard;
