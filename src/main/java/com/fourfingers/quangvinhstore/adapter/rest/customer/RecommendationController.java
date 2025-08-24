package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.RecommendationInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling product recommendation operations.
 * Mapped to the "/recommendation" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/recommendation")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class RecommendationController {
    private final RecommendationInputBoundary recommendationInputBoundary;

    /**
     * Retrieves product recommendations for the authenticated user.
     *
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the user's product recommendations
     */
    @GetMapping
    public ResponseEntity<?> getRecommendation(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recommendationInputBoundary.getRecommendation(userDetails));
    }

    /**
     * Saves the current recommendation state for the authenticated user.
     *
     * @param userDetails The authenticated user details
     * @return ResponseEntity with no content on successful save
     */
    @GetMapping("/cache")
    public ResponseEntity<?> saveRecommendationOnLogout(@AuthenticationPrincipal UserDetails userDetails) {
        recommendationInputBoundary.saveRecommendation(userDetails);
        return ResponseEntity.noContent().build();
    }

}
