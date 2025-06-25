package com.fourfingers.quangvinhstore.domain.model.customer;

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
    private List<Store> stores;
}
