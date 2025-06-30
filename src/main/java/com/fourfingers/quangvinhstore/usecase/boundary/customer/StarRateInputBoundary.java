package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ListStarRateOutputData;

public interface StarRateInputBoundary {
    ListStarRateOutputData getAllStarRateOfProduct(String id, String pageNumber, String pageSize,
                                                   String numberOfStarRate);
}
