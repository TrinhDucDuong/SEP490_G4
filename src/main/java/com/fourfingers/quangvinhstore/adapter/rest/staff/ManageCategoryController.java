package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @PostMapping(value = "/category", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@RequestPart("categoryInputData") CategoryInputData categoryInputData,
                                    @RequestPart("categoryImages") List<MultipartFile> categoryImages,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(categoryManagementInputBoundary.create(categoryInputData, categoryImages, userDetails));
    }
}
