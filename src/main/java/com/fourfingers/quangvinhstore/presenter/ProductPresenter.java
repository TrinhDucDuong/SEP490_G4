package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Product;
import com.fourfingers.quangvinhstore.usecase.boundary.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductPresenter implements ProductOutputBoundary {
    @Override
    public ListProductOutputData convertToListProductOutputData(List<Product> products) {
        return new ListProductOutputData(products);
    }
}
