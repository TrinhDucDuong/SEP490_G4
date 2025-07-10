package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.adapter.rest.MomoController;
import com.fourfingers.quangvinhstore.adapter.rest.VNPayController;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class OrderController {
    private final CustomerOrderInputBoundary customerOrderInputBoundary;
    private final VNPayController vnpayController;
    private final MomoController momoController;

    @GetMapping
    public ResponseEntity<?> getCustomerOrder(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(customerOrderInputBoundary.getOrders(userDetails));
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody ShippingAddressInputData shippingAddressInputData) {
        BigDecimal totalPrice = customerOrderInputBoundary.placeOrders(userDetails, shippingAddressInputData);
        return ResponseEntity.ok(totalPrice != null);
    }

    @PostMapping("/method")
    public ResponseEntity<?> verifyOrderMethod(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestBody Long orderId,
                                         @RequestBody String purchaseType){
        if(purchaseType.equalsIgnoreCase("cod")){
            return ResponseEntity.ok(customerOrderInputBoundary.verifyCODOrder(userDetails, orderId));
        } else if (purchaseType.equalsIgnoreCase("vnpay")) {
//            return vnpayController.showQRPage();
        }
        return null;
    }
}
