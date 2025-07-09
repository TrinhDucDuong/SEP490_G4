package com.fourfingers.quangvinhstore.usecase.data.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CustomerSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.OrderSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.RevenueSummary;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DashBoardSummaryOutputData {
    private OrderSummary orderSummary;
    private CustomerSummary customerSummary;
    private RevenueSummary revenueSummary;
}
