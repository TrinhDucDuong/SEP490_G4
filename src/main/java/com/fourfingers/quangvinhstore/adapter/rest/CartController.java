package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.CartInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.CartInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCartDetailsOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling shopping cart operations.
 * Mapped to the "/cart" endpoint.
 *
 * @author DuongTDHE171824
 */
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CartController {

    private final CartInputBoundary cartInputBoundary;

    /**
     * Retrieves the shopping cart for a specific account.
     *
     * @param accountId The unique identifier of the account
     * @return ResponseEntity containing the cart details
     */
    @GetMapping
    public ResponseEntity<ListCartDetailsOutputData> getCart(@RequestParam Long accountId) {
        ListCartDetailsOutputData cart = cartInputBoundary.getCart(accountId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Adds an item to the shopping cart.
     *
     * @param cartInputData The input data containing item details to add
     * @return ResponseEntity containing the updated cart details
     */
    @PostMapping
    public ResponseEntity<ListCartDetailsOutputData> addToCart(@RequestBody CartInputData cartInputData) {
        ListCartDetailsOutputData updatedCart = cartInputBoundary.addToCart(cartInputData);
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * Removes an item from the shopping cart.
     *
     * @param cartInputData The input data containing item details to remove
     * @return ResponseEntity containing the updated cart details
     */
    @PutMapping
    public ResponseEntity<ListCartDetailsOutputData> removeFromCart(@RequestBody CartInputData cartInputData) {
        ListCartDetailsOutputData updatedCart = cartInputBoundary.removeFromCart(cartInputData);
        return ResponseEntity.ok(updatedCart);
    }

}
