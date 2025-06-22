package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.BlogInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/blog")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BlogController {
    private final BlogInputBoundary blogInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(blogInputBoundary.getAll());
    }
}
