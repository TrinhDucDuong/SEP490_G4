package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OrderDetails {
    private ProductVariant productVariant;
    private Long quantity;
    private BigDecimal unitPrice;
}
