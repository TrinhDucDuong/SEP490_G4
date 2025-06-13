package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.account.AccountInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageAccountController {
    private final AccountManagementInputBoundary accountManagementInputBoundary;
    @GetMapping("/account")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountManagementInputBoundary.getAllAccounts());
    }

    @PostMapping("/account")
    public ResponseEntity<?> createAccount(@RequestBody AccountInputData accountInputData,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(accountManagementInputBoundary.createAccount(accountInputData, userDetails));
    }

    @GetMapping("/account/{id}")
    public ResponseEntity<?> getAccount(@PathVariable String id) {
        return ResponseEntity.ok(accountManagementInputBoundary.getAccount(id));
    }
}
