package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.StarRateInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.StarRateInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling star rating operations for products.
 * Mapped to the "/star-rate" endpoint.
 *
 * @author LongLTHE170099
 * @author DuongTDHE171824
 */
@RestController
@RequestMapping("/star-rate")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StarRateController {
    private final StarRateInputBoundary starRateInputBoundary;

    /**
     * Retrieves star ratings for a specific product with pagination support.
     *
     * @param productId        The unique identifier of the product
     * @param pageNumber       The page number for pagination (defaults to 0)
     * @param pageSize         The number of items per page (defaults to 3)
     * @param numberOfStarRate Optional filter for specific star rating value
     * @return ResponseEntity containing the list of star ratings
     */
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = true) String productId,
                                    @RequestParam(required = false, defaultValue = "0") String pageNumber,
                                    @RequestParam(required = false, defaultValue = "3") String pageSize,
                                    @RequestParam(required = false) String numberOfStarRate) {
        return ResponseEntity.ok(starRateInputBoundary.getAllStarRateOfProduct(productId, pageNumber,
                pageSize, numberOfStarRate));
    }

    /**
     * Submits a new star rating review for a product by an authenticated user.
     *
     * @param starRateInputData The star rating and review data
     * @param userDetails       The authenticated user details
     * @return ResponseEntity containing the created review
     */
    @PostMapping
    public ResponseEntity<?> reviewProduct(@RequestBody StarRateInputData starRateInputData,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(starRateInputBoundary.reviewProduct(starRateInputData, userDetails));
    }
}
