package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardCategorySalesInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardRevenueGraphInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.DashBoardSummaryInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardCategorySalesInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardRevenueGraphInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.DashBoardSummaryInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class DashBoardController {

    private final DashBoardSummaryInputBoundary dashBoardSummaryInputBoundary;
    private final DashBoardRevenueGraphInputBoundary dashBoardRevenueGraphInputBoundary;
    private final DashBoardCategorySalesInputBoundary dashBoardCategorySalesInputBoundary;

    @PostMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestBody DashBoardSummaryInputData dashBoardSummaryInputData) {
        return ResponseEntity.ok(dashBoardSummaryInputBoundary.getDashBoardSummary(dashBoardSummaryInputData));
    }

    @PostMapping("/graph-revenue")
    public ResponseEntity<?> getRevenueGraph(@RequestBody DashBoardRevenueGraphInputData dashBoardRevenueGraphInputData) {
        return ResponseEntity.ok(dashBoardRevenueGraphInputBoundary.getDashBoardRevenueGraph(dashBoardRevenueGraphInputData));
    }

    @PostMapping("/categories-sales")
    public ResponseEntity<?> getCategorySales(@RequestBody DashBoardCategorySalesInputData dashBoardCategorySalesInputData) {
        return ResponseEntity.ok(dashBoardCategorySalesInputBoundary.getCategorySales(dashBoardCategorySalesInputData));
    }
}
