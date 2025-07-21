package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.BlogInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blog")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BlogController {
    private final BlogInputBoundary blogInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String blogTag) {
        return ResponseEntity.ok(blogInputBoundary.getAll(blogTag));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(blogInputBoundary.getById(id));
    }
}
