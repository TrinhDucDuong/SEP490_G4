package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.customer.Product;
import com.fourfingers.quangvinhstore.domain.model.customer.ProductVariant;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductWithVariantsOutputData;

import java.util.List;

public interface ProductManagementOutputBoundary {
    ProductWithVariantsOutputData convertProductWithVariantsOutputData(Product product,
                                                                       List<ProductVariant> productVariants);
}
