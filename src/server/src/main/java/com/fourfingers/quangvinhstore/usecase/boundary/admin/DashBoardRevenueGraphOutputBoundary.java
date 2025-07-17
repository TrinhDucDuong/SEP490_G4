package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.DailyRevenue;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphOutputData;

import java.util.List;

public interface DashBoardRevenueGraphOutputBoundary {
    DashBoardRevenueGraphOutputData convertToDashBoardRevenueGraphOutputData(
            List<DailyRevenue> dailyRevenues);
}
