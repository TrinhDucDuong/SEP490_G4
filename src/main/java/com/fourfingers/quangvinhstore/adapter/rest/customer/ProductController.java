package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.SearchProductInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProductController {
    private final ProductInputBoundary productInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllProducts(@RequestParam(required = false) List<String> categoryIds,
                                            @RequestParam(required = false) List<String> brandIds,
                                            @RequestParam(required = false) List<String> colorHexes,
                                            @RequestParam(required = false) List<String> productSizes,
                                            @RequestParam(required = false) BigDecimal price,
                                            @RequestParam(defaultValue = "desc") String sortDirection,
                                            @RequestParam(defaultValue = "createdAt") String sortBy,
                                            @RequestParam(defaultValue = "0") String pageNumber,
                                            @RequestParam(defaultValue = "20") String pageSize) {
        SearchProductInputData searchProductInputData = new SearchProductInputData(
                categoryIds, brandIds, productSizes, colorHexes, price
        );
        return ResponseEntity.ok(productInputBoundary.search(searchProductInputData, sortDirection, sortBy,
                pageNumber,
                pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productInputBoundary.getProduct(id));
    }
}
