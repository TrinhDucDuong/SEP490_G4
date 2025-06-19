package com.fourfingers.quangvinhstore.domain.model;

import com.fourfingers.quangvinhstore.domain.model.enums.ProductSizeEnum;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductVariant {
    private ProductSizeEnum productSize;
    private Color color;
    private Long quantity;
    private List<Store> stores;
}
