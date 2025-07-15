package com.fourfingers.quangvinhstore.domain.model.staff;

import lombok.*;

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

    public ProductVariant(Long productVariantId, String productSize, Color color, Long quantity) {
        this.productVariantId = productVariantId;
        this.productSize = productSize;
        this.color = color;
        this.quantity = quantity;
    }
}
