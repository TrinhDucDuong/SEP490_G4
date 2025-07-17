package com.fourfingers.quangvinhstore.domain.model.admin;

import com.azure.core.annotation.Get;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CustomerSummary {
    private Long totalCustomer;
    private Double customerGrowthRate;
}
