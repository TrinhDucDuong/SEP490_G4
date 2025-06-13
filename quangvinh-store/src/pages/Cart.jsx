import { useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div className={`fixed top-0 right-0 h-full w-[80vw] sm:w-80 lg:w-96 bg-black text-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 z-50 overflow-x-hidden`}>
            <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-bold">Giỏ Hàng</h2>
                    <button onClick={onClose} className="text-white hover:text-yellow-400 active:text-yellow-500 text-sm sm:text-base">
                        Đóng
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
                            <div key={item.id} className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2 text-sm sm:text-base">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-400">
                                        {item.price.toLocaleString('vi-VN')} VNĐ x {item.quantity}
                                    </p>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 active:text-red-900 p-2">
                                    Xóa
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
                        <span className="font-semibold">Tổng cộng:</span>
                        <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <Link to="/checkout" onClick={onClose} className="block w-full text-center bg-yellow-400 text-black py-2 sm:py-3 rounded hover:bg-yellow-500 active:bg-yellow-600 transition text-sm sm:text-base">
                        Thanh Toán
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;