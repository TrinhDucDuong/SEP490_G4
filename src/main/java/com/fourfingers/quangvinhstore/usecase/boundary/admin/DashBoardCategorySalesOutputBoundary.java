package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CategorySalesReport;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesOutputData;

import java.util.List;

public interface DashBoardCategorySalesOutputBoundary {
    DashBoardCategorySalesOutputData convertToDashBoardCategorySalesOutputData(List<CategorySalesReport>
                                                                                       categorySalesReports);
}
