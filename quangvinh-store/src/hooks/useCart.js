import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LOCAL_CART_KEY = 'guest_cart';

function useCart() {
    const { user, token, loading } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);

    const fetchUserCart = async () => {
        if (!user?.accountId) return;

        try {
            const res = await fetch(`http://localhost:9999/cart/${user.accountId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const text = await res.text();
            if (!res.ok || !text) {
                setCartItems([]);
                return;
            }

            const data = JSON.parse(text);
            const mapped = data.map((item) => ({
                id: item.cartDetailsId,
                key: `${item.productVariant.product.productId}_${item.productVariant.color.colorHex}_${item.productVariant.productSize}`,
                productId: item.productVariant.product.productId,
                productName: item.productVariant.product.productName,
                productImage: item.productVariant.product.images?.[0]?.imageUrl || '',
                colorHexCode: item.productVariant.color.colorHex,
                sizeCode: item.productVariant.productSize,
                quantity: item.quantity,
                price: item.productVariant.product.unitPrice,
            }));

            setCartItems(mapped);
        } catch (err) {
            console.error('Lỗi fetch giỏ hàng:', err);
            setCartItems([]);
        }
    };

    const syncGuestCartToDB = async () => {
        const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];

        for (const item of localCart) {
            try {
                await fetch(`http://localhost:9999/cart`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        cartDetailsId: 0,
                        accountId: user.accountId,
                        productId: item.productId,
                        colorHexCode: item.colorHexCode,
                        sizeCode: item.sizeCode,
                        quantity: item.quantity,
                    }),
                });
            } catch (err) {
                console.error('Lỗi đồng bộ sản phẩm:', err);
            }
        }

        localStorage.removeItem(LOCAL_CART_KEY);
        await fetchUserCart();
    };

    useEffect(() => {
        if (loading) return;

        if (user?.accountId) {
            syncGuestCartToDB();
        } else {
            const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
            setCartItems(localCart);
        }
    }, [user, loading]);

    const saveLocalCart = (items) => {
        if (!user?.accountId) {
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
        }
    };

    const addToCart = async (newItem) => {
        const key = `${newItem.productId}_${newItem.colorHexCode}_${newItem.sizeCode}`;

        if (user?.accountId) {
            try {
                const res = await fetch(`http://localhost:9999/cart`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        cartDetailsId: 0,
                        accountId: user.accountId,
                        productId: newItem.productId,
                        colorHexCode: newItem.colorHexCode,
                        sizeCode: newItem.sizeCode,
                        quantity: newItem.quantity
                    })
                });

                if (!res.ok) throw new Error('Thêm giỏ hàng thất bại');
                await fetchUserCart();
            } catch (err) {
                console.error('[addToCart] Lỗi:', err);
            }
        } else {
            setCartItems((prev) => {
                const exists = prev.find((item) => item.key === key);
                let updated;

                if (exists) {
                    updated = prev.map((item) =>
                        item.key === key
                            ? { ...item, quantity: item.quantity + newItem.quantity }
                            : item
                    );
                } else {
                    updated = [...prev, { ...newItem, key }];
                }

                saveLocalCart(updated);
                return updated;
            });
        }
    };

    const removeItem = (idOrKey) => {
        const updated = cartItems.filter((item) => item.id !== idOrKey && item.key !== idOrKey);
        setCartItems(updated);
        saveLocalCart(updated);
    };

    const updateQuantity = (idOrKey, quantity) => {
        const updated = cartItems.map((item) =>
            item.id === idOrKey || item.key === idOrKey
                ? { ...item, quantity }
                : item
        );
        setCartItems(updated);
        saveLocalCart(updated);
    };

    return { cartItems, addToCart, removeItem, updateQuantity };
}

export default useCart;
