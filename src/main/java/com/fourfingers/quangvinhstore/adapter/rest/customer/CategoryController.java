package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.CategoryInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling category-related operations.
 * Mapped to the "/category" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/category")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CategoryController {
    private final CategoryInputBoundary categoryInputBoundary;

    /**
     * Retrieves all category information from the system.
     *
     * @return ResponseEntity containing a list of all categories
     */
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(categoryInputBoundary.getAll());
    }
}
