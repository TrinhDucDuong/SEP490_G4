package com.fourfingers.quangvinhstore.usecase.data.customer;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ShippingAddressInputData {
    private Long shippingAddressId;
    private String name;
    private String phoneNumber;
    private String address;
    private String exactAddress;
    private boolean isMain;
    private String type;
}
