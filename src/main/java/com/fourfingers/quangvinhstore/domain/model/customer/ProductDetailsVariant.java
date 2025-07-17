package com.fourfingers.quangvinhstore.domain.model.customer;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductDetailsVariant {
    private String productSize;
    private String colorHex;
    private Long quantity;
}
