package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductInputData;
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
@RequestMapping("/staff/product")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageProductController {
    private final ProductManagementInputBoundary productManagementInputBoundary;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@RequestPart("productInputData") ProductInputData productInputData,
                                    @RequestPart("productImages") List<MultipartFile> productImages,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        productInputData.setProductImages(productImages);
        return ResponseEntity.ok(productManagementInputBoundary.create(productInputData, userDetails));
    }

    @GetMapping
    public ResponseEntity<?> find(@RequestParam(required = false) String name) {
        return ResponseEntity.ok(productManagementInputBoundary.findAllProducts(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productManagementInputBoundary.getProduct(id));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> getProduct(@PathVariable String id,
                                        @RequestPart("productInputData") ProductInputData productInputData,
                                        @RequestPart(value = "productImages", required = false) List<MultipartFile> productImages,
                                        @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        productInputData.setProductImages(productImages);
        return ResponseEntity.ok(productManagementInputBoundary.update(
                id,
                productInputData,
                userDetails
        ));
    }
}
