package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.PolicyInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/policy")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class PolicyController {
    private final PolicyInputBoundary viewPolicyInputBoundary;
    @GetMapping
    public ResponseEntity<?> getPolicy() {
        return ResponseEntity.ok(viewPolicyInputBoundary.findAll());
    }
}
