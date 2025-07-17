package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.BrandManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BrandInputData;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@RequestPart BrandInputData brandInputData,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    @RequestPart List<MultipartFile> brandImages) throws Exception {
        brandInputData.setBrandImages(brandImages);
        return ResponseEntity.ok(brandManagementInputBoundary.create(brandInputData, userDetails));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@RequestPart BrandInputData brandInputData,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable String id,
                                    @RequestPart List<MultipartFile> brandImages) throws Exception {
        brandInputData.setBrandImages(brandImages);
        return ResponseEntity.ok(brandManagementInputBoundary.save(id, brandInputData, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return ResponseEntity.ok(brandManagementInputBoundary.delete(id));
    }
}
