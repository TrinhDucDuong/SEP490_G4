package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/customer-account")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCustomerAccountController {
    private final AccountManagementInputBoundary accountManagementInputBoundary;
    @GetMapping()
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountManagementInputBoundary.getAllAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAccount(@PathVariable String id) {
        return ResponseEntity.ok(accountManagementInputBoundary.getAccount(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable String id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(accountManagementInputBoundary.delete(id, userDetails));
    }
}
