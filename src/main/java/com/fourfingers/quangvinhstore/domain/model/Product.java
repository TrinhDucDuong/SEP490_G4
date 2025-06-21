package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Product {
    private String productId;
    private String productName;
    private String productDescription;
    private BigDecimal unitPrice;
}
