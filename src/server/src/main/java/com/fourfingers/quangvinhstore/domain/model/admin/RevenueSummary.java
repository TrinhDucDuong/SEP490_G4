package com.fourfingers.quangvinhstore.domain.model.admin;

import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RevenueSummary {
    private BigDecimal totalRevenue;
    private Double revenueGrowthRate;
}
