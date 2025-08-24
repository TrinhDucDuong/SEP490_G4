package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.OrderManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProcessOrderInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling order management operations for staff members.
 * Mapped to the "/staff/order" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff/order")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageOrderController {
    private final OrderManagementInputBoundary orderManagementInputBoundary;

    /**
     * Retrieves all orders with optional filtering and sorting.
     *
     * @param orderStatus   Optional parameter to filter orders by status
     * @param sortBy        Field to sort by, defaults to "orderDate"
     * @param sortDirection Sort direction ("asc" or "desc"), defaults to "desc"
     * @return ResponseEntity containing a list of orders
     */
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String orderStatus,
                                    @RequestParam(defaultValue = "orderDate") String sortBy,
                                    @RequestParam(defaultValue = "desc") String sortDirection) {
        return ResponseEntity.ok(orderManagementInputBoundary.getAll(orderStatus, sortBy, sortDirection));
    }

    /**
     * Processes an order with the given ID.
     *
     * @param processOrderInputData The order processing data
     * @param id                    The unique identifier of the order to process
     * @param userDetails           The authenticated staff member's details
     * @return ResponseEntity containing the processed order result
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> processOrder(@RequestBody ProcessOrderInputData processOrderInputData,
                                          @PathVariable String id,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderManagementInputBoundary.processOrder(id, processOrderInputData, userDetails));
    }
}
