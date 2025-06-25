package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.input.product.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.output.product.ProductDetailsOutputData;

public interface ProductInputBoundary {
    ListProductOutputData search(SearchProductInputData searchProductInputData, String sortDirection,
                                 String sortBy,
                                 String pageNumber,
                                 String pageSize);

    ProductDetailsOutputData getProduct(String id);
}
