package com.fourfingers.quangvinhstore.domain.model.staff;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Store {
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
