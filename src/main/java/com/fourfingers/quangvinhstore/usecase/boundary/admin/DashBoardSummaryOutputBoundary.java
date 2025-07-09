package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CustomerSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.OrderSummary;
import com.fourfingers.quangvinhstore.domain.model.admin.RevenueSummary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryOutputData;

public interface DashBoardSummaryOutputBoundary {
    DashBoardSummaryOutputData convertToDashBoardSummaryOutputData(
            OrderSummary orderSummary,
            CustomerSummary customerSummary,
            RevenueSummary revenueSummary
    );
}
