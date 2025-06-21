package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.*;
import com.fourfingers.quangvinhstore.usecase.boundary.LandingPageOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.home.LandingPageOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LandingPagePresenter implements LandingPageOutputBoundary {

    @Override
    public LandingPageOutputData convertToLandingPageOutputData(List<Product> newestProducts,
                                                                List<Product> topSellingProducts,
                                                                List<Brand> brands,
                                                                List<Category> categories,
                                                                List<Blog> blogs,
                                                                List<Feedback> feedbacks,
                                                                List<Image> bannerImages) {
        return new LandingPageOutputData(newestProducts,
                topSellingProducts,
                brands,
                categories,
                blogs,
                feedbacks,
                bannerImages);
    }
}
