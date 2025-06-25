package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.customer.Color;
import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.domain.model.customer.ProductVariant;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductDetailsOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductWithVariantsOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductPresenter implements ProductOutputBoundary, ProductManagementOutputBoundary {
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

    @Override
    public ProductWithVariantsOutputData convertProductWithVariantsOutputData(Product product, List<ProductVariant> productVariants) {
        return new ProductWithVariantsOutputData(product, productVariants);
    }
}
