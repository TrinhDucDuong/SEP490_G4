package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Color;
import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductDetailsOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductOutputData;

import java.util.List;

public interface ProductOutputBoundary {
    ListProductOutputData convertToListProductOutputData(List<Product> products);
    ProductOutputData convertToProductOutputData(Product product);
    ProductDetailsOutputData convertToProductDetailsOutputData(Product product, List<String> productSizes, List<Color> productColors);
}
