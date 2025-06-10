package com.fourfingers.quangvinhstore.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProductWithStarRate {
    private Product product;
    private Double starRate;
}
