package com.fourfingers.quangvinhstore.presenter.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CustomerSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.OrderSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.RevenueSummary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardSummaryOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryOutputData;
import org.springframework.stereotype.Component;

@Component
public class DashBoardSummaryPresenter implements DashBoardSummaryOutputBoundary {
    @Override
    public DashBoardSummaryOutputData convertToDashBoardSummaryOutputData(OrderSummary orderSummary,
                                                                          CustomerSummary customerSummary,
                                                                          RevenueSummary revenueSummary) {
        return new DashBoardSummaryOutputData(orderSummary, customerSummary, revenueSummary);
    }
}
