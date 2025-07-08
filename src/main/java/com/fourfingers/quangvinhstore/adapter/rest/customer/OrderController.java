package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class OrderController {
    private final CustomerOrderInputBoundary customerOrderInputBoundary;

    @GetMapping
    public ResponseEntity<?> getCustomerOrder(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(customerOrderInputBoundary.getOrders(userDetails));
    }
}
