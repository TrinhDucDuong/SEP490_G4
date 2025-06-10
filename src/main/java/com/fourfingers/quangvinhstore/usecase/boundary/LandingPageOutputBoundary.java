package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.domain.model.ProductWithStarRate;
import com.fourfingers.quangvinhstore.usecase.data.output.home.LandingPageOutputData;

import java.util.List;

public interface LandingPageOutputBoundary {
    LandingPageOutputData convertToLandingPageOutputData(List<Product> products, 
                                                         List<ProductWithStarRate> topSellingProducts);
}
