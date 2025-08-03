package com.fourfingers.quangvinhstore.domain.model.staff;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductVariant {
    private Long productVariantId;
    private String productSize;
    private Color color;
    private Long quantity;
    private String productName;
    private List<Store> stores;

    public ProductVariant(Long productVariantId, String productSize, Color color, Long quantity) {
        this.productVariantId = productVariantId;
        this.productSize = productSize;
        this.color = color;
        this.quantity = quantity;
    }
}
