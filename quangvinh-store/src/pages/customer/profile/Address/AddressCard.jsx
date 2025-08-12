import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';


function AddressCard({ item, onEdit, onSetMain, onDelete, readonly = false }) {
    const typeDisplayMap = {
        HOME: "Nhà riêng",
        WORK: "Văn phòng",
        OTHER: "Khác",
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-200 p-4 bg-white shadow hover:shadow-lg transition-all duration-300 space-y-3 sm:space-y-0">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-lg text-gray-900">{item.name}</span>
                    {item.isMain && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Mặc định
                        </span>
                    )}
                    <span className="text-xs italic text-gray-500 capitalize">
                        {typeDisplayMap[item.type] || "Không xác định"}
                    </span>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                    <p>
                        <span className="font-semibold text-gray-800">SĐT:</span> {item.phoneNumber}
                    </p>
                    <p>
                        <span className="font-semibold text-gray-800">Địa chỉ:</span> {item.exactAddress}, {item.address}
                    </p>
                </div>

                {!readonly && !item.isMain && (
                    <button
                        onClick={onSetMain}
                        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 border border-emerald-300 rounded-full px-3 py-1 hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Đặt làm mặc định
                    </button>
                )}
            </div>

            {!readonly && (
                <div className="flex gap-2 sm:flex-col sm:items-end w-full sm:w-auto">
                    <button
                        className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                        onClick={onEdit}
                        title="Chỉnh sửa"
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        onClick={onDelete}
                        title="Xóa"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddressCard;
