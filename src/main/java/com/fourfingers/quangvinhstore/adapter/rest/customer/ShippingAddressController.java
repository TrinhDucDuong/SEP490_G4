package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ShippingAddressInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ShippingAddressController {
    private final ShippingAddressInputBoundary shippingAddressInputBoundary;

    @GetMapping
    public ResponseEntity<?> getCustomerShippingAddress(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(shippingAddressInputBoundary.getShippingAddress(userDetails));
    }

    @PostMapping
    public ResponseEntity<?> saveCustomerShippingAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                         @RequestBody ShippingAddressInputData shippingAddressInputData) {
        return ResponseEntity.ok(shippingAddressInputBoundary.saveShippingAddress(userDetails, shippingAddressInputData));
    }

    @PutMapping
    public ResponseEntity<?> deleteCustomerShippingAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                           @RequestParam Long shippingAddressId) {
        return ResponseEntity.ok(shippingAddressInputBoundary.deleteShippingAddress(userDetails, shippingAddressId));
    }
}
