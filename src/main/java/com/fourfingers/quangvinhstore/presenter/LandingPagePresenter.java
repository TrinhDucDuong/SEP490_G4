package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.domain.model.ProductWithStarRate;
import com.fourfingers.quangvinhstore.usecase.boundary.LandingPageOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.home.LandingPageOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LandingPagePresenter implements LandingPageOutputBoundary {

    @Override
    public LandingPageOutputData convertToLandingPageOutputData(List<Product> products, List<ProductWithStarRate> topSellingProducts) {
        return new LandingPageOutputData(products, topSellingProducts);
    }
}
