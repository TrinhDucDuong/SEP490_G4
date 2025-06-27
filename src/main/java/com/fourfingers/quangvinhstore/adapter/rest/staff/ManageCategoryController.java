package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCategoryController {
    private final CategoryManagementInputBoundary categoryManagementInputBoundary;

    @GetMapping("/category/{id}")
    public ResponseEntity<?> findAll(@PathVariable String id) {
        return ResponseEntity.ok(categoryManagementInputBoundary.getCategory(id));
    }

    @GetMapping("/category")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(categoryManagementInputBoundary.getAll());
    }
}
