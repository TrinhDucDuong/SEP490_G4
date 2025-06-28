package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.StarRateInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/star-rate")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StarRateController {
    private final StarRateInputBoundary starRateInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String productId,
                                    @RequestParam(required = false) String pageNumber,
                                    @RequestParam(required = false) String pageSize) {
        return ResponseEntity.ok(starRateInputBoundary.getAllStarRateOfProduct(productId, pageNumber, pageSize));
    }
}
