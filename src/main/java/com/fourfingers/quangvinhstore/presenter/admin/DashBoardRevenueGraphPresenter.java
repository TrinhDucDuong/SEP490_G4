package com.fourfingers.quangvinhstore.presenter.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.DailyRevenue;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardRevenueGraphOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DashBoardRevenueGraphPresenter implements DashBoardRevenueGraphOutputBoundary {
    @Override
    public DashBoardRevenueGraphOutputData convertToDashBoardRevenueGraphOutputData(List<DailyRevenue> dailyRevenues) {
        return new DashBoardRevenueGraphOutputData(dailyRevenues);
    }
}
