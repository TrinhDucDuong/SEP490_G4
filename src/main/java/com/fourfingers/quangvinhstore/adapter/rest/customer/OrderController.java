package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.adapter.rest.MomoController;
import com.fourfingers.quangvinhstore.adapter.rest.VNPayController;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.PurchaseInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Map;


//@RestController
@Controller
@RequestMapping("/order")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class OrderController {
    private final CustomerOrderInputBoundary customerOrderInputBoundary;
    private final VNPayController vnpayController;
    private final MomoController momoController;

    @GetMapping(produces = "application/json")
    public ResponseEntity<?> getCustomerOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(customerOrderInputBoundary.getOrders(userDetails));
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<?> getCustomerOrder(@PathVariable Long id,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(customerOrderInputBoundary.getOrder(id, userDetails));
    }

    @PostMapping(produces = "application/json")
    public ResponseEntity<?> placeOrderFromCart(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody ShippingAddressInputData shippingAddressInputData) {
        return ResponseEntity.ok(customerOrderInputBoundary.placeOrders(userDetails, shippingAddressInputData));
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> verifyOrderByMethod(
                                        @AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody PurchaseInputData purchaseInputData,
                                        HttpServletRequest request){
        String paymentMethod = purchaseInputData.getPaymentMethod();
        if(paymentMethod.equalsIgnoreCase("COD")){
            return ResponseEntity.ok(customerOrderInputBoundary.placeOrderPayLater(userDetails, purchaseInputData));
        } else {
            OrderOutputData orderOutputData = customerOrderInputBoundary
                    .getOrder(purchaseInputData.getOrderId(), userDetails);
            if (paymentMethod.equalsIgnoreCase("VNPay")) {
                try {
                    vnpayController.showQRPage(orderOutputData, customerOrderInputBoundary, request);
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
            } else if (paymentMethod.equalsIgnoreCase("MOMO")) {
                try {
                    momoController.createMomoPayment(orderOutputData.getOrder().getTotalPrice());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
            return ResponseEntity.ok("Đã chuyển hướng đến cổng thanh toán");
        }
    }

    @GetMapping("payment/return")
    public ResponseEntity<?> verifyPaymentReturn(Map<String, String> map){
        return ResponseEntity.ok(customerOrderInputBoundary.verifyAndPlaceOrderPayInAdvance(map));
    }
}
