package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.ShippingAddress;
import com.fourfingers.quangvinhstore.usecase.boundary.ShippingAddressOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListShippingAddressOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ShippingAddressPresenter implements ShippingAddressOutputBoundary {
    @Override
    public ListShippingAddressOutputData convertToListShippingAddressOutputData(List<ShippingAddress> shippingAddresses) {
        return new ListShippingAddressOutputData(shippingAddresses);
    }
}
