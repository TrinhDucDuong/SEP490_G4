package com.fourfingers.quangvinhstore.domain.model.customer;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Store {
    private Long storeId;
    private String storeName;
    private String storeAddress;
}
