package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface RecommendationInputBoundary {
    ListProductOutputData getRecommendation(UserDetails userDetails);

    void saveRecommendation(UserDetails userDetails);
}
