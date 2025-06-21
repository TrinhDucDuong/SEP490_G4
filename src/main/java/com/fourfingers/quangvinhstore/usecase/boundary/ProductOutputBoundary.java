package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductOutputData;

import java.util.List;

public interface ProductOutputBoundary {
    ListProductOutputData convertToListProductOutputData(List<Product> products);
    ProductOutputData convertToProductOutputData(Product product);
}
