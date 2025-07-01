package com.fourfingers.quangvinhstore.domain.model;

import com.fourfingers.quangvinhstore.domain.model.customer.Color;
import com.fourfingers.quangvinhstore.domain.model.customer.Store;
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
