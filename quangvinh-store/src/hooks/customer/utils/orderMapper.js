export const mapSingleOrder = (order) => {
    const items = order.orderDetails.map((detail) => {
        const productVariant = detail.productVariant;
        const product = productVariant.product;
        return {
            productId: product.productId,
            name: product.productName,
            price: detail.unitPrice,
            quantity: detail.quantity,
            size: productVariant.productSize,
            colorHex: productVariant.color?.colorHex || '#000',
            brandName: product.brand?.brandName || null,
            categoryName: product.category?.categoryName || null,
        };
    });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
        orderId: order.orderId,
        owner: order.owner
            ? {
                accountId: order.owner.accountId,
                username: order.owner.username,
                email: order.owner.email,
            }
            : null,
        orderStatus: order.orderStatus,
        orderDate: order.orderDate,
        estimatedDeliveryDate: order.estimatedDeliveryDate || null,
        shippingAddress: order.shippingAddress
            ? {
                shippingAddressId: order.shippingAddress.shippingAddressId,
                name: order.shippingAddress.name,
                phoneNumber: order.shippingAddress.phoneNumber,
                address: order.shippingAddress.address,
                exactAddress: order.shippingAddress.exactAddress,
                type: order.shippingAddress.type,
            }
            : null,
        paymentMethod: order.paymentMethod || 'Chưa cập nhật',
        paymentStatus: order.paymentStatus ?? false,
        items,
        subtotal,
        shippingFee: order.shippingFee || 0,
        voucherDiscount: order.voucherDiscount || 0,
        total: order.totalPrice || subtotal,
    };
};
