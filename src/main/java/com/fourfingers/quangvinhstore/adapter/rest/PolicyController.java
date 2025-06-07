package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.PolicyInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.policy.PolicyInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/policy")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class PolicyController {
    private final PolicyInputBoundary policyInputBoundary;
    @GetMapping
    public ResponseEntity<?> getPolicy() {
        return ResponseEntity.ok(policyInputBoundary.findAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getPolicyById(@PathVariable String id) {
        return ResponseEntity.ok(policyInputBoundary.findById(id));
    }
    @PostMapping
    public ResponseEntity<?> savePolicy(@RequestBody PolicyInputData inputData) {
        return ResponseEntity.ok(policyInputBoundary.save(null, inputData));
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePolicy(@PathVariable String id, @RequestBody PolicyInputData inputData) {
        return ResponseEntity.ok(policyInputBoundary.save(id, inputData));
    }
    @DeleteMapping("{id}")
    public ResponseEntity<?> deletePolicy(@PathVariable String id) {
        return ResponseEntity.ok(policyInputBoundary.delete(id));
    }
}
