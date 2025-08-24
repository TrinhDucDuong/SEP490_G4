package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.StoreInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling store-related operations.
 * Mapped to the "/store" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/store")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StoreController {
    private final StoreInputBoundary storeInputBoundary;

    /**
     * Retrieves all store information from the system.
     *
     * @return ResponseEntity containing a list of all stores
     */
    @GetMapping
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(storeInputBoundary.findAll());
    }

    /**
     * Retrieves a specific store by its ID.
     *
     * @param storeId The unique identifier of the store
     * @return ResponseEntity containing the requested store information
     */
    @GetMapping("/{storeId}")
    public ResponseEntity<?> getStoreById(@PathVariable String storeId) {
        return ResponseEntity.ok(storeInputBoundary.findById(storeId));
    }
}