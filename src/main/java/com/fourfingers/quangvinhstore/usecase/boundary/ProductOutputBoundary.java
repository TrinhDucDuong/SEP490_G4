package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.usecase.data.output.ListProductOutputData;

import java.util.List;

public interface ProductOutputBoundary {
    ListProductOutputData convertToListProductOutputData(List<Product> products);
}
