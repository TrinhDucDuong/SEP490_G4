package com.fourfingers.quangvinhstore.domain.model.customer;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Product {
    private Long productId;
    private String productName;
    private String productDescription;
    private BigDecimal unitPrice;
    private Double starRateAvg;
    private List<Image> images;
    private Long totalSoldOut;
}
