package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.CartInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.CartInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListCartDetailsOutputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CartController {

    private final CartInputBoundary cartInputBoundary;

    @GetMapping
    public ResponseEntity<ListCartDetailsOutputData> getCart(@RequestBody Long accountId) {
        ListCartDetailsOutputData cart = cartInputBoundary.getCart(accountId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<ListCartDetailsOutputData> addToCart(@RequestBody CartInputData cartInputData) {
        ListCartDetailsOutputData updatedCart = cartInputBoundary.addToCart(cartInputData);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping
    public ResponseEntity<ListCartDetailsOutputData> removeFromCart(@RequestBody CartInputData cartInputData) {
        ListCartDetailsOutputData updatedCart = cartInputBoundary.removeFromCart(cartInputData);
        return ResponseEntity.ok(updatedCart);
    }

}
