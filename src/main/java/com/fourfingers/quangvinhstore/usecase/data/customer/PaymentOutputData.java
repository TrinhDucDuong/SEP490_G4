package com.fourfingers.quangvinhstore.usecase.data.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PaymentOutputData {
    private OrderOutputData orderOutputData;
    private String paymentUrl;
}
