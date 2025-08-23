// Hàm mapSingleOrder: Dùng để chuyển đổi dữ liệu đơn hàng từ API về định dạng dễ sử dụng trong FE
export const mapSingleOrder = (order) => {
    // Lấy ra danh sách sản phẩm trong đơn hàng (orderDetails)
    const items = order.orderDetails.map((detail) => {
        const productVariant = detail.productVariant; // Biến thể sản phẩm (màu, size,...)
        const product = productVariant.product;       // Sản phẩm gốc

        return {
            productId: product.productId,                   // ID sản phẩm
            name: product.productName,                      // Tên sản phẩm
            description: product.productDescription,        // Mô tả sản phẩm
            price: detail.unitPrice,                        // Giá 1 sản phẩm (từ chi tiết đơn hàng)
            quantity: detail.quantity,                      // Số lượng mua
            size: productVariant.productSize,               // Size sản phẩm
            colorHex: productVariant.color?.colorHex || '#000', // Mã màu (nếu có), mặc định đen
            brand: product.brand
                ? {                                         // Thông tin thương hiệu (nếu có)
                    brandId: product.brand.brandId,
                    brandName: product.brand.brandName,
                    brandDescription: product.brand.brandDescription,
                    images: product.brand.images || [],
                }
                : null,
            category: product.category
                ? {                                         // Thông tin danh mục (nếu có)
                    categoryId: product.category.categoryId,
                    categoryName: product.category.categoryName,
                    images: product.category.images || [],
                }
                : null,
            images: detail.image ? [detail.image.imageUrl] : [], // Ảnh sản phẩm trong đơn
            starRateAvg: product.starRateAvg ?? null,       // Điểm đánh giá trung bình
            totalSoldOut: product.totalSoldOut ?? null,     // Tổng số đã bán
            totalQuantity: product.totalQuantity ?? null,   // Tổng số lượng tồn
            productVariants: product.productVariants?.map(v => ({ // Các biến thể khác của sản phẩm
                size: v.productSize,
                colorHex: v.colorHex || null,
                quantity: v.quantity
            })) || [],
            stores: productVariant.stores?.map(store => ({  // Các cửa hàng có bán sản phẩm
                storeId: store.storeId,
                storeName: store.storeName,
                storeAddress: store.storeAddress,
                storePhone: store.storePhone,
                city: store.city,
                district: store.district,
                startWorkingAt: store.startWorkingAt,
                endWorkingAt: store.endWorkingAt,
                locationLat: store.locationLat,
                locationLng: store.locationLng
            })) || []
        };
    });

    // Tính tổng tiền hàng (subtotal) = Σ (giá * số lượng)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Trả về object đơn hàng đã được map
    return {
        orderId: order.orderId,                     // ID đơn hàng
        orderCode: order.orderCode,                 // Mã đơn hàng
        owner: order.owner
            ? {                                     // Thông tin người đặt (nếu có)
                accountId: order.owner.accountId,
                username: order.owner.username,
                email: order.owner.email,
                isActive: order.owner.isActive
            }
            : null,
        orderStatus: order.orderStatus,             // Trạng thái đơn hàng
        orderDate: order.orderDate,                 // Ngày đặt hàng
        estimatedDeliveryDate: order.estimatedDeliveryDate || null, // Ngày giao dự kiến
        shippingAddress: order.shippingAddress
            ? {                                     // Địa chỉ giao hàng (nếu có)
                shippingAddressId: order.shippingAddress.shippingAddressId,
                name: order.shippingAddress.name,
                phoneNumber: order.shippingAddress.phoneNumber,
                address: order.shippingAddress.address,
                exactAddress: order.shippingAddress.exactAddress,
                isMain: order.shippingAddress.isMain ?? null,
                type: order.shippingAddress.type,
            }
            : null,
        paymentMethod: order.paymentMethod || 'Chưa cập nhật', // Phương thức thanh toán
        paymentStatus: order.paymentStatus ?? false,           // Trạng thái thanh toán
        items,                          // Danh sách sản phẩm đã map ở trên
        subtotal,                       // Tổng tiền hàng
        shippingFee: order.shippingFee || 0,         // Phí ship
        voucherDiscount: order.voucherDiscount || 0, // Giảm giá từ voucher
        total: order.totalPrice ?? subtotal,         // Tổng thanh toán (nếu không có thì = subtotal)
    };
};
