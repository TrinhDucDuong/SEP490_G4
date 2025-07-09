package com.fourfingers.quangvinhstore.domain.model.admin;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OrderSummary {
    private Long totalOrder;
    private Double orderGrowthRate;
}
