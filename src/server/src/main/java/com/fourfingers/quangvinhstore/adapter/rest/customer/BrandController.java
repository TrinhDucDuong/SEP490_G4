package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.BrandInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/brand")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BrandController {
    private final BrandInputBoundary brandInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllBrands() {
        return ResponseEntity.ok(brandInputBoundary.getAll());
    }
}
