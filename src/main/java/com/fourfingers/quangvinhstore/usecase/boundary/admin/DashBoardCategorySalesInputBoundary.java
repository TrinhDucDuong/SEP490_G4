package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesOutputData;

public interface DashBoardCategorySalesInputBoundary {
    DashBoardCategorySalesOutputData getCategorySales(DashBoardCategorySalesInputData dashBoardCategorySalesInputData);
}
