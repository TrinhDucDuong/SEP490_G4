package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.StarRate;
import com.fourfingers.quangvinhstore.usecase.data.customer.CustomerStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StarRateOutputData;

import java.util.List;

public interface StarRateOutputBoundary {
    ListStarRateOutputData convertToListStarRateOutputData(List<StarRate> starRates);
    CustomerStarRateOutputData convertToCustomerStarRateOutputData(StarRate starRate);
}
