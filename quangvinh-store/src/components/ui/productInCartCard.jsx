import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function ProductInCartCard({ item, onRemove, onUpdateQuantity }) {
    const {
        id,
        key,
        productImage,
        productName,
        colorHexCode,
        sizeCode,
        quantity,
        price
    } = item;

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity > 0) {
            console.log('[ProductInCartCard] Thay đổi số lượng:', newQuantity);
            onUpdateQuantity(id || key, newQuantity);
        }
    };

    return (
        <div className="flex gap-4 border p-3 rounded-lg">
            <img
                src={productImage}
                alt={productName}
                className="w-20 h-20 object-cover rounded-lg border"
            />
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-800">{productName}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Màu: <span style={{ backgroundColor: colorHexCode }} className="inline-block w-4 h-4 rounded-full border border-gray-300 align-middle mr-1" />
                        <span className="align-middle">{colorHexCode}</span>
                    </p>
                    <p className="text-xs text-gray-500">Kích thước: {sizeCode}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="px-2 py-1 text-gray-600 hover:text-black"
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="px-3 text-sm">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="px-2 py-1 text-gray-600 hover:text-black"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-semibold text-red-500">
                            {(price * quantity).toLocaleString('vi-VN')}₫
                        </p>
                        <button
                            onClick={() => onRemove(id || key)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductInCartCard;
