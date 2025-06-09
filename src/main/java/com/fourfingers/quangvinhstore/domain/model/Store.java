package com.fourfingers.quangvinhstore.domain.model;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Store {
    private String storeName;
    private String storeAddress;
}
