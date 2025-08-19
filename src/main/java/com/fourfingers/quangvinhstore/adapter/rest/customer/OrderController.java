package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.adapter.rest.MomoController;
import com.fourfingers.quangvinhstore.adapter.rest.VNPayController;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.CustomerOrderInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.*;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.GuestOrderInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.order.OrderOutputData;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;


@RestController
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

    @PostMapping //(produces = "application/json")
    public ResponseEntity<?> placeOrderFromCart(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody ShippingAddressIdInputData shippingAddressIdInputData) {
        return ResponseEntity.ok(customerOrderInputBoundary.placeOrders(userDetails, shippingAddressIdInputData));
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> verifyOrderByMethod(
                                        @AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody PurchaseInputData purchaseInputData,
                                        HttpServletRequest request){
        String paymentMethod = purchaseInputData.getPaymentMethod();
        PaymentOutputData paymentOutputData = new PaymentOutputData();
        if(paymentMethod.equalsIgnoreCase("COD")){
            paymentOutputData.setOrderOutputData(customerOrderInputBoundary.placeOrderPayLater(userDetails, purchaseInputData));
        } else {
            OrderOutputData orderOutputData = customerOrderInputBoundary
                    .getOrder(purchaseInputData.getOrderId(), userDetails);
            if(orderOutputData.getOrder().getPaymentStatus() != null){
                throw new RuntimeException("Order has been paid already");
            }
            if (paymentMethod.equalsIgnoreCase("VNPay")) {
                try {
                    String vnpUrl = vnpayController.showQRPage(orderOutputData, customerOrderInputBoundary, request);
                    paymentOutputData.setPaymentUrl(vnpUrl);
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
            }
        }
        return ResponseEntity.ok(paymentOutputData);
    }

    @GetMapping("payment/return")
    public void verifyPaymentReturn(@RequestParam Map<String, String> map, HttpServletResponse response) throws IOException {
        OrderOutputData order = customerOrderInputBoundary.verifyAndPlaceOrderPayInAdvance(map);
        response.sendRedirect("http://localhost:5173/track-order?code=" + order.getOrder().getOrderCode());
    }

    @PostMapping("/now")
    public ResponseEntity<?> orderNow(@RequestBody OrderInputData orderInputData,
                                                              @AuthenticationPrincipal UserDetails userDetails) {
        OrderOutputData orderNow = customerOrderInputBoundary.orderNow(orderInputData, userDetails);
        return ResponseEntity.ok(orderNow);
    }

    @PatchMapping ("/now/{orderId}")
    public ResponseEntity<?> chooseShippingAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestBody ShippingAddressIdInputData shippingAddressIdInputData,
                                                    @PathVariable Long orderId
                                                    ) {
        return ResponseEntity.ok(customerOrderInputBoundary.chooseShippingAddress(userDetails, shippingAddressIdInputData, orderId));
    }

    @PostMapping("/guest")
    public ResponseEntity<?> orderByGuest(@RequestBody GuestOrderInputData guestOrderInputData,
                                          HttpServletRequest request) {
        OrderOutputData orderOutputData = customerOrderInputBoundary.orderByGuest(
                                                                                    guestOrderInputData.getShippingAddressInputData(),
                                                                                    guestOrderInputData.getListProductVariantInputData(),
                                                                                    guestOrderInputData.getPurchaseInputData().getPaymentMethod()
                                                                                    );
        PaymentOutputData paymentOutputData = new PaymentOutputData();
        paymentOutputData.setOrderOutputData(orderOutputData);
        if(guestOrderInputData.getPurchaseInputData().getPaymentMethod().equalsIgnoreCase("VNPay")) {
            try {
                String vnpUrl = vnpayController.showQRPage(orderOutputData, customerOrderInputBoundary, request);
                paymentOutputData.setPaymentUrl(vnpUrl);
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }
        return ResponseEntity.ok(paymentOutputData);
    }

    @GetMapping(value = "/tracking/{orderCode}", produces = "application/json")
    public ResponseEntity<?> trackingOrder(@PathVariable String orderCode) {
        return ResponseEntity.ok(customerOrderInputBoundary.trackingOrder(orderCode));
    }
}
