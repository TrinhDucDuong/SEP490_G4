package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ProductOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface RecommendationInputBoundary {
    String getRecommendation();
}
