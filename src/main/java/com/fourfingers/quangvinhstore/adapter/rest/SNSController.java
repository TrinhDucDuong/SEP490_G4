package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.SNSInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sns")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSController {
    private final SNSInputBoundary snsInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllSNSs() {
        return ResponseEntity.ok(snsInputBoundary.getAllSNSs());
    }
}
