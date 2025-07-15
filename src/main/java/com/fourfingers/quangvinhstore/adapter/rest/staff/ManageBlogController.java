package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BlogInputData;
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
@RequestMapping("/staff/blog")
@RequiredArgsConstructor(onConstructor_ =  {@Autowired})
public class ManageBlogController {
    private final BlogManagementInputBoundary blogManagementInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok().body(blogManagementInputBoundary.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable String id) {
        return ResponseEntity.ok(blogManagementInputBoundary.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(blogManagementInputBoundary.delete(id, userDetails));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@AuthenticationPrincipal UserDetails userDetails,
                                    @RequestPart BlogInputData blogInputData,
                                    @RequestPart List<MultipartFile> blogImages) throws Exception {
        return ResponseEntity.ok(blogManagementInputBoundary.create(blogInputData, userDetails, blogImages));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@AuthenticationPrincipal UserDetails userDetails,
                                    @RequestPart BlogInputData blogInputData,
                                    @RequestPart(required = false) List<MultipartFile> blogImages,
                                    @PathVariable String id) throws Exception {
        return ResponseEntity.ok(blogManagementInputBoundary.update(blogInputData, userDetails, blogImages, id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> unDelete(@AuthenticationPrincipal UserDetails userDetails,
                                      @PathVariable String id) throws Exception {
        return ResponseEntity.ok(blogManagementInputBoundary.unDelete(id, userDetails));
    }
}
