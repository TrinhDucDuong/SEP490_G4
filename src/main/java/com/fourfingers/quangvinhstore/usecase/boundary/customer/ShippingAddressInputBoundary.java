package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ListShippingAddressOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface ShippingAddressInputBoundary {
    ListShippingAddressOutputData getShippingAddress(UserDetails userDetails);

    ListShippingAddressOutputData saveShippingAddress(UserDetails userDetails, ShippingAddressInputData shippingAddressInputData);

    ListShippingAddressOutputData deleteShippingAddress(UserDetails userDetails, Long shippingAddressId);

    ListShippingAddressOutputData updateIsMainShippingAddress(UserDetails userDetails, ShippingAddressInputData shippingAddressInputData);
}
