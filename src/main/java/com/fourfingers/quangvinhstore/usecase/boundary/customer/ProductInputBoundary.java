package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.SearchProductInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListProductOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProductDetailsOutputData;

public interface ProductInputBoundary {
    ListProductOutputData search(SearchProductInputData searchProductInputData, String sortDirection,
                                 String sortBy,
                                 String pageNumber,
                                 String pageSize);

    ProductDetailsOutputData getProduct(String id);
}
