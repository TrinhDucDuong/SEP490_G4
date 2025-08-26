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


/**
 * REST controller handling order-related operations.
 * Mapped to the "/order" endpoint.
 *
 * @author DuongTDHE171824
 */
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class OrderController {
    private final CustomerOrderInputBoundary customerOrderInputBoundary;
    private final VNPayController vnpayController;
    private final MomoController momoController;

    /**
     * Retrieves all orders for the authenticated customer.
     *
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing a list of customer orders
     */
    @GetMapping(produces = "application/json")
    public ResponseEntity<?> getCustomerOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(customerOrderInputBoundary.getOrders(userDetails));
    }

    /**
     * Retrieves a specific order for the authenticated customer.
     *
     * @param id          The unique identifier of the order
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the requested order
     */
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<?> getCustomerOrder(@PathVariable Long id,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(customerOrderInputBoundary.getOrder(id, userDetails));
    }

    /**
     * Places an order from items in the customer's cart.
     *
     * @param userDetails                The authenticated user details
     * @param shippingAddressIdInputData The shipping address information
     * @return ResponseEntity containing the created order details
     */
    @PostMapping
    public ResponseEntity<?> placeOrderFromCart(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody ShippingAddressIdInputData shippingAddressIdInputData) {
        return ResponseEntity.ok(customerOrderInputBoundary.placeOrders(userDetails, shippingAddressIdInputData));
    }

    /**
     * Verifies and processes an order based on the selected payment method.
     *
     * @param userDetails       The authenticated user details
     * @param purchaseInputData The purchase information including payment method
     * @param request           The HTTP servlet request
     * @return ResponseEntity containing payment details
     */
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
            if(orderOutputData.getOrder().getPaymentStatus() != null && customerOrderInputBoundary.handleStock(orderOutputData.getOrder().getOrderId())){
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

    /**
     * Handles payment return verification and redirects to order tracking.
     *
     * @param map      The payment return parameters
     * @param response The HTTP servlet response
     * @throws IOException If redirect fails
     */
    @GetMapping("payment/return")
    public void verifyPaymentReturn(@RequestParam Map<String, String> map, HttpServletResponse response) throws IOException {
        OrderOutputData order = customerOrderInputBoundary.verifyAndPlaceOrderPayInAdvance(map);
        response.sendRedirect("https://quangvinh.store/track-order?code=" + order.getOrder().getOrderCode());
    }

    /**
     * Places an immediate order for the authenticated customer.
     *
     * @param orderInputData The order details
     * @param userDetails    The authenticated user details
     * @return ResponseEntity containing the created order
     */
    @PostMapping("/now")
    public ResponseEntity<?> orderNow(@RequestBody OrderInputData orderInputData,
                                                              @AuthenticationPrincipal UserDetails userDetails) {
        OrderOutputData orderNow = customerOrderInputBoundary.orderNow(orderInputData, userDetails);
        return ResponseEntity.ok(orderNow);
    }

    /**
     * Updates the shipping address for a specific order.
     *
     * @param userDetails                The authenticated user details
     * @param shippingAddressIdInputData The new shipping address information
     * @param orderId                    The unique identifier of the order
     * @return ResponseEntity containing the updated order
     */
    @PatchMapping ("/now/{orderId}")
    public ResponseEntity<?> chooseShippingAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestBody ShippingAddressIdInputData shippingAddressIdInputData,
                                                    @PathVariable Long orderId
                                                    ) {
        return ResponseEntity.ok(customerOrderInputBoundary.chooseShippingAddress(userDetails, shippingAddressIdInputData, orderId));
    }

    /**
     * Places an order for a guest customer.
     *
     * @param guestOrderInputData The guest order details
     * @param request             The HTTP servlet request
     * @return ResponseEntity containing the created order and payment details
     */
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

    /**
     * Tracks the status of an order using its order code.
     *
     * @param orderCode The unique code of the order
     * @return ResponseEntity containing the order tracking information
     */
    @GetMapping(value = "/tracking/{orderCode}", produces = "application/json")
    public ResponseEntity<?> trackingOrder(@PathVariable String orderCode) {
        return ResponseEntity.ok(customerOrderInputBoundary.trackingOrder(orderCode));
    }
}
