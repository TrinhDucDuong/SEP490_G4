package com.fourfingers.quangvinhstore.domain.model.customer;


import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Store {
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private String storePhone;
    private String city;
    private String district;
    private LocalDateTime startWorkingAt;
    private LocalDateTime endWorkingAt;
    private String locationLat;
    private String locationLng;
}
