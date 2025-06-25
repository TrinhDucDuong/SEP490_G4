package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.domain.model.customer.ProductVariant;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductWithVariantsOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductStaffPresenter implements ProductManagementOutputBoundary {
    @Override
    public ProductWithVariantsOutputData convertProductWithVariantsOutputData(Product product, List<ProductVariant> productVariants) {
        return new ProductWithVariantsOutputData(product, productVariants);
    }
}
