package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Product;
import com.fourfingers.quangvinhstore.domain.model.staff.ProductVariant;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductWithVariantsOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductStaffPresenter implements ProductManagementOutputBoundary {

    @Override
    public ProductWithVariantsOutputData convertProductWithVariantsOutputData(Product product,
                                                                              List<ProductVariant> productVariants) {
        return new ProductWithVariantsOutputData();
    }

    @Override
    public ProductOutputData convertToProductOutputData(com.fourfingers.quangvinhstore.domain.model.staff.Product product) {
        return new ProductOutputData(product);
    }

    @Override
    public ListProductOutputData convertToListProductOutputData(List<Product> products) {
        return new ListProductOutputData(products);
    }
}
