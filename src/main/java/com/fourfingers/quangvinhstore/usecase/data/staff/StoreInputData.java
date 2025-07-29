package com.fourfingers.quangvinhstore.usecase.data.staff;

import lombok.*;

import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StoreInputData {
    private String storeName;
    private String storeAddress;
    private String storePhone;
    private String city;
    private String district;
    private LocalTime startWorkingAt;
    private LocalTime endWorkingAt;
    private String locationLat;
    private String locationLng;
}
