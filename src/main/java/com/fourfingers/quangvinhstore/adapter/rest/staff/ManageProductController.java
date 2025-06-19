package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.product.ProductInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff/product")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageProductController {
    private final ProductManagementInputBoundary productManagementInputBoundary;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ProductInputData productInputData,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(productManagementInputBoundary.save(productInputData, userDetails));
    }
}
