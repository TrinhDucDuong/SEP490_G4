package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Color;
import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductDetailsOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductOutputData;
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
