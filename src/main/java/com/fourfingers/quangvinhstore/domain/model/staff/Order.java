package com.fourfingers.quangvinhstore.domain.model.staff;

import com.fourfingers.quangvinhstore.domain.model.ShippingAddress;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Order {
    private Long orderId;
    private String customerName;
    private String customerPhoneNumber;
    private List<OrderDetails> orderDetails;
    private String orderStatus;
    private boolean paymentStatus;
    private LocalDateTime orderDate;
    private String totalPrice;
    private ShippingAddress shippingAddress;
}
