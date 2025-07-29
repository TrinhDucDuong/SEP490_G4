package com.fourfingers.quangvinhstore.domain.model.staff;

import com.fourfingers.quangvinhstore.domain.model.Account;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

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
    private LocalTime startWorkingAt;
    private LocalTime endWorkingAt;
    private String locationLat;
    private String locationLng;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Account createdBy;
    private Account updatedBy;
}
