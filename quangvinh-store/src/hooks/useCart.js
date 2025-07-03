import { useEffect, useState } from 'react';
import {
    fetchCartAPI,
    addToCartAPI,
    updateCartQuantityAPI,
    deleteCartItemAPI,
} from '../utils/api/CartAPI';
import { toast } from 'react-toastify';

const useCart = (accountId, token = null) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const getLocalCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
    const saveLocalCart = (items) => localStorage.setItem('cart', JSON.stringify(items));

    const syncLocalCartToServer = async () => {
        const localCart = getLocalCart();
        if (localCart.length > 0 && accountId) {
            try {
                for (const item of localCart) {
                    await addToCartAPI({
                        accountId,
                        productId: item.productId,
                        colorHexCode: item.colorHexCode,
                        sizeCode: item.sizeCode,
                        quantity: item.quantity,
                        token,
                    });
                }
                localStorage.removeItem('cart');
            } catch (err) {
                console.error('Lỗi đồng bộ giỏ hàng:', err);
                toast.error(err.message || 'Lỗi đồng bộ giỏ hàng');
            }
        }
    };

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            try {
                if (accountId) {
                    await syncLocalCartToServer();
                    const data = await fetchCartAPI(accountId, token);
                    const formatted = data.cart.map((item) => ({
                        id: item.cartDetailsId,
                        productName: item.productVariant.product.productName,
                        productImage: item.productVariant.product.images?.[0]?.imageUrl || '/placeholder.png',
                        colorHexCode: item.productVariant.color.colorHex,
                        sizeCode: item.productVariant.productSize,
                        quantity: item.quantity,
                        price: item.productVariant.product.unitPrice,
                        productId: item.productVariant.product.productId,
                    }));
                    setCartItems(formatted);
                } else {
                    setCartItems(getLocalCart());
                }
            } catch (err) {
                console.error('Lỗi khi fetch giỏ hàng:', err);
                toast.error(err.message || 'Lỗi tải giỏ hàng');
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [accountId, token]);

    const addToCart = async ({ productId, colorHexCode, sizeCode, quantity, productName, productImage, price }) => {
        try {
            if (accountId) {
                await addToCartAPI({ accountId, productId, colorHexCode, sizeCode, quantity, token });
                const data = await fetchCartAPI(accountId, token);
                const formatted = data.cart.map((item) => ({
                    id: item.cartDetailsId,
                    productName: item.productVariant.product.productName,
                    productImage: item.productVariant.product.images?.[0]?.imageUrl || '/placeholder.png',
                    colorHexCode: item.productVariant.color.colorHex,
                    sizeCode: item.productVariant.productSize,
                    quantity: item.quantity,
                    price: item.productVariant.product.unitPrice,
                    productId: item.productVariant.product.productId,
                }));
                setCartItems(formatted);
            } else {
                const localCart = getLocalCart();
                const existing = localCart.find(
                    (item) =>
                        item.productId === productId &&
                        item.colorHexCode === colorHexCode &&
                        item.sizeCode === sizeCode
                );

                if (existing) {
                    const updatedCart = localCart.map((item) =>
                        item.productId === productId &&
                        item.colorHexCode === colorHexCode &&
                        item.sizeCode === sizeCode
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                    setCartItems(updatedCart);
                    saveLocalCart(updatedCart);
                } else {
                    const newItem = {
                        id: `local_${Date.now()}`,
                        productId,
                        productName,
                        productImage,
                        colorHexCode,
                        sizeCode,
                        quantity,
                        price,
                    };
                    const updatedCart = [...localCart, newItem];
                    setCartItems(updatedCart);
                    saveLocalCart(updatedCart);
                }
            }
        } catch (err) {
            console.error('Lỗi thêm vào giỏ hàng:', err);
            throw err; // Để component gọi hàm này xử lý lỗi
        }
    };

    const updateQuantity = async (id, quantity) => {
        try {
            if (accountId) {
                const item = cartItems.find((item) => item.id === id);
                if (!item) {
                    throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
                }
                await updateCartQuantityAPI({
                    cartDetailsId: id,
                    accountId,
                    productId: item.productId,
                    colorHexCode: item.colorHexCode,
                    sizeCode: item.sizeCode,
                    quantity,
                    token,
                });
                setCartItems((prev) =>
                    prev.map((item) => (item.id === id ? { ...item, quantity } : item))
                );
            } else {
                const localCart = getLocalCart();
                const updatedCart = localCart.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                );
                setCartItems(updatedCart);
                saveLocalCart(updatedCart);
            }
        } catch (err) {
            console.error('Lỗi cập nhật số lượng:', err);
            toast.error(err.message || 'Lỗi cập nhật số lượng sản phẩm');
        }
    };

    const removeItem = async (id) => {
        try {
            if (accountId) {
                await deleteCartItemAPI(id, token);
                setCartItems((prev) => prev.filter((item) => item.id !== id));
            } else {
                const localCart = getLocalCart();
                const updatedCart = localCart.filter((item) => item.id !== id);
                setCartItems(updatedCart);
                saveLocalCart(updatedCart);
            }
        } catch (err) {
            console.error('Lỗi xóa sản phẩm:', err);
            toast.error(err.message || 'Lỗi xóa sản phẩm khỏi giỏ hàng');
        }
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    return {
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
    };
};

export default useCart;