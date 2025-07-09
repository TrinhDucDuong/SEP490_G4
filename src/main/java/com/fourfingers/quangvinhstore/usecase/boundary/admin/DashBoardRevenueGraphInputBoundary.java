package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphOutputData;

import java.time.LocalDateTime;

public interface DashBoardRevenueGraphInputBoundary {
    DashBoardRevenueGraphOutputData getDashBoardRevenueGraph(DashBoardRevenueGraphInputData dashBoardRevenueGraphInputData);
}
