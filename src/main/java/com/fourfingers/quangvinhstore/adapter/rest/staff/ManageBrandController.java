package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.BrandManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BrandInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff/brand")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageBrandController {
    private final BrandManagementInputBoundary brandManagementInputBoundary;
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(brandManagementInputBoundary.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBrand(@PathVariable String id) {
        return ResponseEntity.ok(brandManagementInputBoundary.getBrand(id));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BrandInputData brandInputData,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(brandManagementInputBoundary.create(brandInputData, userDetails));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody BrandInputData brandInputData,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable String id) throws Exception {
        return ResponseEntity.ok(brandManagementInputBoundary.save(id, brandInputData, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return ResponseEntity.ok(brandManagementInputBoundary.delete(id));
    }
}
