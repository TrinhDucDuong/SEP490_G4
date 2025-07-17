import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {useFetchProductById} from "../../../../hooks/Customer/useFetchProducts.js";

function ProductInCartCard({ item, onRemove, onUpdateQuantity }) {
    const {
        productImage,
        productName,
        colorHexCode,
        sizeCode,
        quantity,
        price,
    } = item;

    const { product, loading, error } = useFetchProductById(item.productId);

    const image =
        !loading && !error && product?.images?.length > 0
            ? product.images[0].imageUrl
            : null;


    const handleDecrease = () => {
        if (quantity > 1) {
            onUpdateQuantity(-1);
        }
    };

    const handleIncrease = () => {
        onUpdateQuantity(1);
    };

    return (
        <div className="flex items-start gap-4 border p-3 rounded-md shadow-sm">
            <img
                src={image}
                alt={productName}
                className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800">{productName}</h4>
                <div className="text-xs text-gray-500 mt-1">
                    Màu: <span className="inline-block w-3 h-3 rounded-full align-middle ml-1"
                               style={{ backgroundColor: colorHexCode }} />
                    <span className="ml-3">Size: {sizeCode}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 border rounded px-2 py-1 text-sm">
                        <button
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                            className={`text-gray-600 hover:text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="mx-1">{quantity}</span>
                        <button
                            onClick={handleIncrease}
                            className="text-gray-600 hover:text-yellow-500"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <span className="text-sm font-semibold text-yellow-600">
                        {(price * quantity).toLocaleString('vi-VN')} ₫
                    </span>
                </div>
            </div>
            <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 text-sm"
                title="Xóa"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    );
}

export default ProductInCartCard;
