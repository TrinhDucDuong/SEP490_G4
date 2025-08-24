package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ShippingAddressInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ShippingAddressInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling shipping address-related operations.
 * Mapped to the "/addresses" endpoint.
 *
 * @author DuongTDHE171824
 */
@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ShippingAddressController {
    private final ShippingAddressInputBoundary shippingAddressInputBoundary;

    /**
     * Retrieves shipping addresses for the authenticated customer.
     *
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing list of customer's shipping addresses
     */
    @GetMapping
    public ResponseEntity<?> getCustomerShippingAddress(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(shippingAddressInputBoundary.getShippingAddress(userDetails));
    }

    /**
     * Saves a new shipping address for the authenticated customer.
     *
     * @param userDetails              The authenticated user details
     * @param shippingAddressInputData The shipping address data to be saved
     * @return ResponseEntity containing the saved shipping address
     */
    @PostMapping
    public ResponseEntity<?> saveCustomerShippingAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                         @RequestBody ShippingAddressInputData shippingAddressInputData) {
        return ResponseEntity.ok(shippingAddressInputBoundary.saveShippingAddress(userDetails, shippingAddressInputData));
    }

    /**
     * Updates the main shipping address status for the authenticated customer.
     *
     * @param userDetails       The authenticated user details
     * @param shippingAddressId ID of the shipping address to be set as main
     * @return ResponseEntity containing the updated shipping address
     */
    @PatchMapping
    public ResponseEntity<?> updateIsMainShippingAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                           @RequestParam Long shippingAddressId) {
        return ResponseEntity.ok(shippingAddressInputBoundary.updateIsMainShippingAddress(userDetails, shippingAddressId));
    }

    /**
     * Deletes a shipping address for the authenticated customer.
     *
     * @param userDetails       The authenticated user details
     * @param shippingAddressId ID of the shipping address to be deleted
     * @return ResponseEntity containing the operation result
     */
    @DeleteMapping
    public ResponseEntity<?> deleteCustomerShippingAddress(@AuthenticationPrincipal UserDetails userDetails,
                                                           @RequestParam Long shippingAddressId) {
        return ResponseEntity.ok(shippingAddressInputBoundary.deleteShippingAddress(userDetails, shippingAddressId));
    }
}
