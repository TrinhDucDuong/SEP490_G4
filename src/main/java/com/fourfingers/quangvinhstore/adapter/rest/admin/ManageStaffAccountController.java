package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.StaffAccountManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStaffAccountController {
    private final StaffAccountManagementInputBoundary staffAccountManagementInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllStaffAccounts(@RequestParam(required = false, defaultValue = "0") int pageNumber,
                                                 @RequestParam(required = false, defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(staffAccountManagementInputBoundary.search(pageNumber, pageSize));
    }
}
