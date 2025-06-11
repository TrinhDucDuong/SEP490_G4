package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.AccountManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageAccountController {
    private final AccountManagementInputBoundary accountManagementInputBoundary;
    @GetMapping("/account")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(accountManagementInputBoundary.getAllAccounts());
    }
}
