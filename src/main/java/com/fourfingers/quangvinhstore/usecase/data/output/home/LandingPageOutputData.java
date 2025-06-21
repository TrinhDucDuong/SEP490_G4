package com.fourfingers.quangvinhstore.usecase.data.output.home;

import com.fourfingers.quangvinhstore.domain.model.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LandingPageOutputData {
    private List<Product> newestProducts;
    private List<Product> topSellingProducts;
    private List<Brand> brands;
    private List<Category> categories;
    private List<Blog> blogs;
    private List<Feedback> feedbacks;
    private List<Image> bannerImages;
}
