package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.SNSManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.SNSInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller responsible for managing SNS (Social Networking Service) operations in the admin interface.
 * Provides endpoints for creating, retrieving, and deleting SNS entries.
 */
@RestController
@RequestMapping("/admin/sns")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageSNSController {
    private final SNSManagementInputBoundary snsManagementInputBoundary;

    /**
     * Retrieves a list of all SNS entries in the system.
     *
     * @param userDetails the authenticated user details requesting the SNS list
     * @return ResponseEntity containing list of all SNS entries
     */
    @GetMapping
    public ResponseEntity<?> getAllSNSs(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(snsManagementInputBoundary.getAllSNSs(userDetails));
    }

    /**
     * Creates a new SNS entry in the system.
     *
     * @param snsInputData the SNS data to be saved
     * @param userDetails  the authenticated user details performing the operation
     * @return ResponseEntity containing the saved SNS entry
     */
    @PostMapping
    public ResponseEntity<?> saveSNS(@RequestBody SNSInputData snsInputData,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(snsManagementInputBoundary.save(snsInputData, userDetails));
    }

    /**
     * Retrieves a specific SNS entry by its ID.
     *
     * @param id          the unique identifier of the SNS entry
     * @param userDetails the authenticated user details requesting the SNS entry
     * @return ResponseEntity containing the requested SNS entry details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSNS(@PathVariable Long id,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(snsManagementInputBoundary.getSNS(id, userDetails));
    }

    /**
     * Deletes an SNS entry with the specified ID.
     *
     * @param id          the unique identifier of the SNS entry to delete
     * @param userDetails the authenticated user details performing the deletion
     * @return ResponseEntity containing the deletion operation result
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSNS(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(snsManagementInputBoundary.delete(id, userDetails));
    }
}
