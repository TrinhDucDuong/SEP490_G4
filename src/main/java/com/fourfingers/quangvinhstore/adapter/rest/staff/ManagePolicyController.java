package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.PolicyManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.policy.PolicyInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManagePolicyController {
    private final PolicyManagementInputBoundary managePolicyBoundary;
    @GetMapping("/policy")
    public ResponseEntity<?> getPolicy() {
        return ResponseEntity.ok(managePolicyBoundary.findAll());
    }
    @GetMapping("/policy/{id}")
    public ResponseEntity<?> getPolicyById(@PathVariable String id) {
        return ResponseEntity.ok(managePolicyBoundary.findById(id));
    }
    @PostMapping("/policy")
    public ResponseEntity<?> savePolicy(@RequestBody PolicyInputData inputData) {
        return ResponseEntity.ok(managePolicyBoundary.save(null, inputData));
    }
    @PutMapping("/policy/{id}")
    public ResponseEntity<?> updatePolicy(@PathVariable String id, @RequestBody PolicyInputData inputData) {
        return ResponseEntity.ok(managePolicyBoundary.save(id, inputData));
    }
    @DeleteMapping("/policy/{id}")
    public ResponseEntity<?> deletePolicy(@PathVariable String id) {
        return ResponseEntity.ok(managePolicyBoundary.delete(id));
    }
}
