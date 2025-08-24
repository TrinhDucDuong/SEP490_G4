package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.PolicyManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.PolicyInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling policy management operations for staff members.
 * Mapped to the "/staff" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManagePolicyController {
    private final PolicyManagementInputBoundary managePolicyBoundary;

    /**
     * Retrieves all policies from the system.
     *
     * @return ResponseEntity containing a list of all policies
     */
    @GetMapping("/policy")
    public ResponseEntity<?> getPolicy() {
        return ResponseEntity.ok(managePolicyBoundary.findAll());
    }

    /**
     * Retrieves a specific policy by its ID.
     *
     * @param id The unique identifier of the policy
     * @return ResponseEntity containing the requested policy
     */
    @GetMapping("/policy/{id}")
    public ResponseEntity<?> getPolicyById(@PathVariable String id) {
        return ResponseEntity.ok(managePolicyBoundary.findById(id));
    }

    /**
     * Creates a new policy in the system.
     *
     * @param inputData   The policy data to be saved
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the saved policy
     */
    @PostMapping("/policy")
    public ResponseEntity<?> savePolicy(@RequestBody PolicyInputData inputData,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(managePolicyBoundary.save(null, inputData, userDetails));
    }

    /**
     * Updates an existing policy in the system.
     *
     * @param id          The unique identifier of the policy to update
     * @param inputData   The updated policy data
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the updated policy
     */
    @PutMapping("/policy/{id}")
    public ResponseEntity<?> updatePolicy(@PathVariable String id, @RequestBody PolicyInputData inputData,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(managePolicyBoundary.save(id, inputData, userDetails));
    }

    /**
     * Deletes a policy from the system.
     *
     * @param id          The unique identifier of the policy to delete
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the operation result
     */
    @DeleteMapping("/policy/{id}")
    public ResponseEntity<?> deletePolicy(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(managePolicyBoundary.delete(id, userDetails));
    }
}
