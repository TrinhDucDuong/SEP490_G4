package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.ResetPasswordStaffAccountInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.ResetPasswordStaffAccountInputData;
import com.fourfingers.quangvinhstore.usecase.data.admin.StaffAccountInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller responsible for managing staff account operations in the admin interface.
 * Provides endpoints for CRUD operations on staff accounts and password reset functionality.
 */
@RestController
@RequestMapping("/admin/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStaffAccountController {
    private final StaffAccountManagementInputBoundary staffAccountManagementInputBoundary;
    private final ResetPasswordStaffAccountInputBoundary resetPasswordStaffAccountInputBoundary;

    /**
     * Retrieves a paginated list of all staff accounts.
     *
     * @param pageNumber the page number for pagination (zero-based indexing)
     * @param pageSize   the number of items per page
     * @return ResponseEntity containing the paginated list of staff accounts
     */
    @GetMapping
    public ResponseEntity<?> getAllStaffAccounts(@RequestParam(required = false, defaultValue = "0") int pageNumber,
                                                 @RequestParam(required = false, defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(staffAccountManagementInputBoundary.search(pageNumber, pageSize));
    }

    /**
     * Creates a new staff account.
     *
     * @param staffAccountInputData the staff account data to create
     * @param userDetails           the authenticated user creating the account
     * @return ResponseEntity containing the created staff account details
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody StaffAccountInputData staffAccountInputData,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(staffAccountManagementInputBoundary.create(staffAccountInputData, userDetails));
    }

    /**
     * Retrieves a specific staff account by its ID.
     *
     * @param id the unique identifier of the staff account
     * @return ResponseEntity containing the requested staff account details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(staffAccountManagementInputBoundary.getById(id));
    }

    /**
     * Deletes a staff account with the specified ID.
     *
     * @param id          the unique identifier of the staff account to delete
     * @param userDetails the authenticated user performing the deletion
     * @return ResponseEntity with no content on successful deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        staffAccountManagementInputBoundary.delete(id, userDetails);
        return ResponseEntity.noContent().build();
    }

    /**
     * Restores a previously deleted staff account.
     *
     * @param id          the unique identifier of the staff account to restore
     * @param userDetails the authenticated user performing the restoration
     * @return ResponseEntity with no content on successful restoration
     */
    @PatchMapping("/{id}")
    public ResponseEntity<?> unDelete(@PathVariable String id,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        staffAccountManagementInputBoundary.unDelete(id, userDetails);
        return ResponseEntity.noContent().build();
    }

    /**
     * Resets the password for a staff account.
     *
     * @param id                                 the unique identifier of the staff account
     * @param userDetails                        the authenticated user performing the password reset
     * @param resetPasswordStaffAccountInputData the new password data
     * @return ResponseEntity containing boolean indicating success of password reset
     */
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Boolean> resetPassword(@PathVariable Long id,
                                                 @AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody ResetPasswordStaffAccountInputData resetPasswordStaffAccountInputData) {

        return ResponseEntity.ok(resetPasswordStaffAccountInputBoundary.resetPassword(id,
                resetPasswordStaffAccountInputData, userDetails));
    }
}
