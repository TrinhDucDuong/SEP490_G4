
import { useEffect, useState } from 'react';
import {fetchCartAPI} from "../../utils/api/Customer/CartAPI.js";


const useFetchCarts = (accountId) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!accountId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchCartAPI(accountId);
                const formatted = data.cart.map((item) => ({
                    id: item.cartDetailsId,
                    productName: item.productVariant.product.productName,
                    productImage: item.productVariant.product.images?.[0]?.imageUrl || '/placeholder.png',
                    colorHexCode: item.productVariant.color.colorHex,
                    sizeCode: item.productVariant.productSize,
                    quantity: item.quantity,
                    price: item.productVariant.product.unitPrice,
                }));
                setCartItems(formatted);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accountId]);


    return { cartItems, loading, error, setCartItems };
};

export default useFetchCarts;
