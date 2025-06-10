package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Product {
    private String productName;
    private String productDescription;
    private String productImageUrl;
    private BigDecimal unitPrice;
}
