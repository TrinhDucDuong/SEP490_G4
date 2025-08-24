package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.BrandInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling brand-related operations.
 * Mapped to the "/brand" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/brand")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BrandController {
    private final BrandInputBoundary brandInputBoundary;

    /**
     * Retrieves all brand information from the system.
     *
     * @return ResponseEntity containing a list of all brands
     */
    @GetMapping
    public ResponseEntity<?> getAllBrands() {
        return ResponseEntity.ok(brandInputBoundary.getAll());
    }
}
