package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.azure.core.annotation.Post;
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

@RestController
@RequestMapping("/admin/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStaffAccountController {
    private final StaffAccountManagementInputBoundary staffAccountManagementInputBoundary;
    private final ResetPasswordStaffAccountInputBoundary resetPasswordStaffAccountInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllStaffAccounts(@RequestParam(required = false, defaultValue = "0") int pageNumber,
                                                 @RequestParam(required = false, defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(staffAccountManagementInputBoundary.search(pageNumber, pageSize));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody StaffAccountInputData staffAccountInputData,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(staffAccountManagementInputBoundary.create(staffAccountInputData, userDetails));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(staffAccountManagementInputBoundary.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        staffAccountManagementInputBoundary.delete(id, userDetails);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> unDelete(@PathVariable String id,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        staffAccountManagementInputBoundary.unDelete(id, userDetails);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Boolean> resetPassword(@PathVariable Long id,
                                                 @AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody ResetPasswordStaffAccountInputData resetPasswordStaffAccountInputData) {

        return ResponseEntity.ok(resetPasswordStaffAccountInputBoundary.resetPassword(id,
                resetPasswordStaffAccountInputData, userDetails));
    }
}
