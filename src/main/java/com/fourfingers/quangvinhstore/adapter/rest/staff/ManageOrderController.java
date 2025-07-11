package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.OrderManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProcessOrderInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff/order")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageOrderController {
    private final OrderManagementInputBoundary orderManagementInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String orderStatus,
                                    @RequestParam(defaultValue = "orderDate") String sortBy,
                                    @RequestParam(defaultValue = "desc") String sortDirection) {
        return ResponseEntity.ok(orderManagementInputBoundary.getAll(orderStatus, sortBy, sortDirection));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> processOrder(@RequestBody ProcessOrderInputData processOrderInputData,
                                          @PathVariable String id) {
        return ResponseEntity.ok(orderManagementInputBoundary.processOrder(id, processOrderInputData));
    }
}
