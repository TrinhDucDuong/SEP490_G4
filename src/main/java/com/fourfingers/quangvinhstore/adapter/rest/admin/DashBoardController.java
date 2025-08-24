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

/**
 * REST controller handling administrative dashboard operations.
 * Provides endpoints for retrieving dashboard summary, revenue graphs,
 * and category sales data.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class DashBoardController {

    /**
     * Input boundary for dashboard summary operations
     */
    private final DashBoardSummaryInputBoundary dashBoardSummaryInputBoundary;
    /**
     * Input boundary for dashboard revenue graph operations
     */
    private final DashBoardRevenueGraphInputBoundary dashBoardRevenueGraphInputBoundary;
    /**
     * Input boundary for dashboard category sales operations
     */
    private final DashBoardCategorySalesInputBoundary dashBoardCategorySalesInputBoundary;

    /**
     * Retrieves dashboard summary data based on provided input parameters.
     *
     * @param dashBoardSummaryInputData the input data containing parameters for summary generation
     * @return ResponseEntity containing the generated dashboard summary data
     */
    @PostMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestBody DashBoardSummaryInputData dashBoardSummaryInputData) {
        return ResponseEntity.ok(dashBoardSummaryInputBoundary.getDashBoardSummary(dashBoardSummaryInputData));
    }

    /**
     * Retrieves revenue graph data based on provided input parameters.
     *
     * @param dashBoardRevenueGraphInputData the input data containing parameters for revenue graph generation
     * @return ResponseEntity containing the generated revenue graph data
     */
    @PostMapping("/graph-revenue")
    public ResponseEntity<?> getRevenueGraph(@RequestBody DashBoardRevenueGraphInputData dashBoardRevenueGraphInputData) {
        return ResponseEntity.ok(dashBoardRevenueGraphInputBoundary.getDashBoardRevenueGraph(dashBoardRevenueGraphInputData));
    }

    /**
     * Retrieves category sales data based on provided input parameters.
     *
     * @param dashBoardCategorySalesInputData the input data containing parameters for category sales data generation
     * @return ResponseEntity containing the generated category sales data
     */
    @PostMapping("/categories-sales")
    public ResponseEntity<?> getCategorySales(@RequestBody DashBoardCategorySalesInputData dashBoardCategorySalesInputData) {
        return ResponseEntity.ok(dashBoardCategorySalesInputBoundary.getCategorySales(dashBoardCategorySalesInputData));
    }
}
