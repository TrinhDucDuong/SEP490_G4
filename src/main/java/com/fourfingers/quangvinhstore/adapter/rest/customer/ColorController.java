package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ColorInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/color")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ColorController {
    private final ColorInputBoundary colorInputBoundary;
    @GetMapping
    public ResponseEntity<?> getAllColors() {
        return ResponseEntity.ok(colorInputBoundary.getAll());
    }
}
