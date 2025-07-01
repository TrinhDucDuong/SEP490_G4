package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CartDetails {
    private Long cartDetailsId;
    private ProductVariant productVariant;
    private Short quantity;
}
