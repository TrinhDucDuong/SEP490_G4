package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.ShippingAddress;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListShippingAddressOutputData;

import java.util.List;

public interface ShippingAddressOutputBoundary {
    ListShippingAddressOutputData convertToListShippingAddressOutputData(List<ShippingAddress> shippingAddresses);
}
