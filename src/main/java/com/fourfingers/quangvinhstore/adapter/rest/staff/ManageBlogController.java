package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> delete(@PathVariable String id) {
        return ResponseEntity.ok(blogManagementInputBoundary.delete(id));
    }
}
