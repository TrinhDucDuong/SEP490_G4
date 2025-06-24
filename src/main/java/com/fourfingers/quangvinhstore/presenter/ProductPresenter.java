package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Color;
import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductDetailsOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductPresenter implements ProductOutputBoundary {
    @Override
    public ListProductOutputData convertToListProductOutputData(List<Product> products) {
        return new ListProductOutputData(products);
    }

    @Override
    public ProductOutputData convertToProductOutputData(Product product) {
        return new ProductOutputData(product);
    }

    @Override
    public ProductDetailsOutputData convertToProductDetailsOutputData(Product product, List<String> productSizes, List<Color> productColors) {
        return new ProductDetailsOutputData(product, productSizes, productColors);
    }
}
