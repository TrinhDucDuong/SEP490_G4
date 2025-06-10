package com.fourfingers.quangvinhstore.usecase.data.output.home;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.domain.model.ProductWithStarRate;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LandingPageOutputData {
    private List<Product> products;
    private List<ProductWithStarRate> topSellingProducts;
}
