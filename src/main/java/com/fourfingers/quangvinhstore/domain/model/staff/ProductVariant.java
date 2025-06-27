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
}
