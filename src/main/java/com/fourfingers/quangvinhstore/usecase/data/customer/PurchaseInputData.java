package com.fourfingers.quangvinhstore.usecase.data.customer;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PurchaseInputData {
    private Long orderId;
    private String paymentMethod;
}
