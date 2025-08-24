package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller responsible for managing customer account operations in the admin interface.
 * Provides endpoints for retrieving, viewing and deleting customer accounts.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/admin/customer-account")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCustomerAccountController {
    private final AccountManagementInputBoundary accountManagementInputBoundary;

    /**
     * Retrieves a list of all customer accounts in the system.
     *
     * @return ResponseEntity containing list of all customer accounts
     */
    @GetMapping()
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountManagementInputBoundary.getAllAccounts());
    }

    /**
     * Retrieves a specific customer account by its ID.
     *
     * @param id the unique identifier of the customer account
     * @return ResponseEntity containing the requested customer account details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAccount(@PathVariable String id) {
        return ResponseEntity.ok(accountManagementInputBoundary.getAccount(id));
    }

    /**
     * Deletes a customer account with the specified ID.
     *
     * @param id          the unique identifier of the customer account to delete
     * @param userDetails the authenticated user details performing the deletion
     * @return ResponseEntity containing the deletion operation result
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable String id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(accountManagementInputBoundary.delete(id, userDetails));
    }
}
