package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.product.SearchProductInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProductController {
    private final ProductInputBoundary productInputBoundary;

    @PostMapping
    public ResponseEntity<?> getAllProducts(@RequestBody SearchProductInputData searchProductInputData,
                                            @RequestParam(defaultValue = "desc") String sortDirection,
                                            @RequestParam(defaultValue = "createdAt") String sortBy,
                                            @RequestParam(defaultValue = "0") String pageNumber,
                                            @RequestParam(defaultValue = "10") String pageSize) {
        return ResponseEntity.ok(productInputBoundary.search(searchProductInputData, sortDirection, sortBy,
                pageNumber,
                pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productInputBoundary.getProduct(id));
    }
}
