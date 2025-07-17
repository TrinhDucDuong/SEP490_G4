package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryOutputData;

public interface DashBoardSummaryInputBoundary {
    DashBoardSummaryOutputData getDashBoardSummary(DashBoardSummaryInputData dashBoardSummaryInputData);
}
