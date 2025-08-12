package com.fourfingers.quangvinhstore.usecase.data.customer.order;

import com.fourfingers.quangvinhstore.usecase.data.customer.ProductVariantInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.PurchaseInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import lombok.Data;

import java.util.List;

@Data
public class GuestOrderInputData {
    private ShippingAddressInputData shippingAddressInputData;
    private List<ProductVariantInputData> listProductVariantInputData;
    private PurchaseInputData purchaseInputData;
}
