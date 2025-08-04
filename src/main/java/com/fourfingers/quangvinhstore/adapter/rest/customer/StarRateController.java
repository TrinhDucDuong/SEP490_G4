package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.StarRateInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.StarRateInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/star-rate")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StarRateController {
    private final StarRateInputBoundary starRateInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = true) String productId,
                                    @RequestParam(required = false, defaultValue = "0") String pageNumber,
                                    @RequestParam(required = false, defaultValue = "3") String pageSize,
                                    @RequestParam(required = false) String numberOfStarRate) {
        return ResponseEntity.ok(starRateInputBoundary.getAllStarRateOfProduct(productId, pageNumber,
                pageSize, numberOfStarRate));
    }

    @PostMapping
    public ResponseEntity<?> reviewProduct(@RequestBody StarRateInputData starRateInputData,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(starRateInputBoundary.reviewProduct(starRateInputData, userDetails));
    }
}
