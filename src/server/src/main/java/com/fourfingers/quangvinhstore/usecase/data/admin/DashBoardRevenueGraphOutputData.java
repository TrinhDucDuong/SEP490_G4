package com.fourfingers.quangvinhstore.usecase.data.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.DailyRevenue;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DashBoardRevenueGraphOutputData {
    private List<DailyRevenue> dailyRevenues;
}
