import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ProductInCartCard from '../../components/ui/productInCartCard.jsx';

function Cart({ isOpen, onClose }) {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Sản phẩm A', price: 100000, quantity: 2 },
        { id: 2, name: 'Sản phẩm B', price: 150000, quantity: 1 },
        { id: 3, name: 'Sản phẩm C', price: 200000, quantity: 3 },
    ]);

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-[80vw] sm:w-80 lg:w-96 bg-white text-black transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 z-50 overflow-x-hidden`}>
            <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-bold">Giỏ Hàng</h2>
                    <button onClick={onClose} className="text-black hover:text-yellow-400 active:text-yellow-500 text-sm sm:text-base">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                    <span className="text-sm sm:text-base">{cartItems.length} sản phẩm</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm sm:text-base">Giỏ hàng trống</p>
                    ) : (
                        cartItems.map(item => (
                            <ProductInCartCard
                                key={item.id}
                                item={item}
                                onRemove={removeItem}
                                onUpdateQuantity={(id, newQty) => {
                                    setCartItems(prev =>
                                        prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
                                    );
                                }}
                            />

                        ))
                    )}
                </div>

                <div className="mt-4">
                    <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
                        <span className="font-semibold">Tổng cộng:</span>
                        <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <Link to="/payment" onClick={onClose} className="block w-full text-center bg-yellow-400 text-black py-2 sm:py-3 rounded hover:bg-yellow-500 active:bg-yellow-600 transition text-sm sm:text-base">
                        Thanh Toán
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;
