package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Product;
import com.fourfingers.quangvinhstore.domain.model.staff.ProductVariant;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductWithVariantsOutputData;

import java.util.List;

public interface ProductManagementOutputBoundary {
    ProductWithVariantsOutputData convertProductWithVariantsOutputData(Product product,
                                                                       List<ProductVariant> productVariants);
    ProductOutputData convertToProductOutputData(Product product);

    ListProductOutputData convertToListProductOutputData(List<Product> products);
}
