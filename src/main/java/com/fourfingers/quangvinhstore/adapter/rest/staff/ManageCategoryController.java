package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCategoryController {
    private final CategoryManagementInputBoundary categoryManagementInputBoundary;

    @GetMapping("/category")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(categoryManagementInputBoundary.getAll());
    }
}
