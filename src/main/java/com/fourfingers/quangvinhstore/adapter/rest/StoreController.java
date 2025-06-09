package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.StoreInputBoundary;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/store")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StoreController {
    private final StoreInputBoundary storeInputBoundary;
    @GetMapping
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(storeInputBoundary.findAll());
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<?> getStoreById(@PathVariable String storeId) {
        return ResponseEntity.ok(storeInputBoundary.findById(storeId));
    }
}
