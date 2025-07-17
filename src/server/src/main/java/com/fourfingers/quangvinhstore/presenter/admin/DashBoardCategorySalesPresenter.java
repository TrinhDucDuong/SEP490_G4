package com.fourfingers.quangvinhstore.presenter.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CategorySalesReport;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardCategorySalesOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DashBoardCategorySalesPresenter implements DashBoardCategorySalesOutputBoundary {
    @Override
    public DashBoardCategorySalesOutputData convertToDashBoardCategorySalesOutputData(List<CategorySalesReport>
                                                                                              categorySalesReports) {
        return new DashBoardCategorySalesOutputData(categorySalesReports);
    }
}
