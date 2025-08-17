package com.fourfingers.quangvinhstore.domain.model.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
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
    private Brand brand;
    private Category category;
    private Long totalQuantity;
    private List<ProductDetailsVariant> productVariants;

    public Product(Long productId, String productName, String productDescription, BigDecimal unitPrice,
                   Double starRateAvg, Long totalSoldOut) {
        this.productId = productId;
        this.productName = productName;
        this.productDescription = productDescription;
        this.unitPrice = unitPrice;
        this.starRateAvg = starRateAvg;
        this.totalSoldOut = totalSoldOut;
    }
}
