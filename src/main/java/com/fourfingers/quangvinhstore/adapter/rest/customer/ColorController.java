package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ColorInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling color-related operations.
 * Mapped to the "/color" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/color")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ColorController {
    private final ColorInputBoundary colorInputBoundary;

    /**
     * Retrieves all color information from the system.
     *
     * @return ResponseEntity containing a list of all colors
     */
    @GetMapping
    public ResponseEntity<?> getAllColors() {
        return ResponseEntity.ok(colorInputBoundary.getAll());
    }
}
