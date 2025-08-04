package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.CustomerStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.StarRateInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StarRateOutputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface StarRateInputBoundary {
    ListStarRateOutputData getAllStarRateOfProduct(String id, String pageNumber, String pageSize,
                                                   String numberOfStarRate);

    CustomerStarRateOutputData reviewProduct(StarRateInputData starRateInputData, UserDetails userDetails);
}
