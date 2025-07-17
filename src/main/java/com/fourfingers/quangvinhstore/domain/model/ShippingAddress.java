package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ShippingAddress {
    private Long shippingAddressId;
    private String name;
    private String phoneNumber;
    private String address;
    private String exactAddress;
    private Boolean isMain;
    private String type;
}
