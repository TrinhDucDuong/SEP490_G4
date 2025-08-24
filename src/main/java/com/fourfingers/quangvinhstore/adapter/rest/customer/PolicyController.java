package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.PolicyInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller handling policy-related operations.
 * Mapped to the "/policy" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/policy")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class PolicyController {
    private final PolicyInputBoundary viewPolicyInputBoundary;

    /**
     * Retrieves all policy information from the system.
     *
     * @return ResponseEntity containing a list of all policies
     */
    @GetMapping
    public ResponseEntity<?> getPolicy() {
        return ResponseEntity.ok(viewPolicyInputBoundary.findAll());
    }
}
