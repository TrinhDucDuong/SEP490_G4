package com.fourfingers.quangvinhstore.usecase.data.input.store;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class StoreInputData {
    private String storeName;
    private String storeAddress;
}
