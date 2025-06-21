package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.*;
import com.fourfingers.quangvinhstore.usecase.data.output.home.LandingPageOutputData;

import java.util.List;

public interface LandingPageOutputBoundary {
    LandingPageOutputData convertToLandingPageOutputData(List<Product> newestProducts,
                                                         List<Product> topSellingProducts,
                                                         List<Brand> brands,
                                                         List<Category> categories,
                                                         List<Blog> blogs,
                                                         List<Feedback> feedbacks,
                                                         List<Image> bannerImages);
}
