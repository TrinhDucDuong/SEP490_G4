package com.fourfingers.quangvinhstore.usecase.data.customer;

import com.fourfingers.quangvinhstore.domain.model.ShippingAddress;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ListShippingAddressOutputData {
    private List<ShippingAddress> shippingAddresses;
}
