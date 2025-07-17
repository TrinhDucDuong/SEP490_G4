package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.domain.model.admin.CategorySalesReport;
import com.fourfingers.quangvinhstore.infrastructure.repository.CategoryRepository;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardCategorySalesInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardCategorySalesOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class DashBoardCategorySalesUseCaseInteraction implements DashBoardCategorySalesInputBoundary {
    private final CategoryRepository categoryRepository;
    private final DashBoardCategorySalesOutputBoundary dashBoardCategorySalesOutputBoundary;

    @Override
    public DashBoardCategorySalesOutputData getCategorySales(DashBoardCategorySalesInputData
                                                                         dashBoardCategorySalesInputData) {
        if(dashBoardCategorySalesInputData.getStartTime().isAfter(dashBoardCategorySalesInputData.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        List<CategorySalesReport> categorySalesReports = categoryRepository.getCategorySalesReport(
                dashBoardCategorySalesInputData.getStartTime(),
                dashBoardCategorySalesInputData.getEndTime()
        );
        return dashBoardCategorySalesOutputBoundary.convertToDashBoardCategorySalesOutputData(categorySalesReports);
    }
}
