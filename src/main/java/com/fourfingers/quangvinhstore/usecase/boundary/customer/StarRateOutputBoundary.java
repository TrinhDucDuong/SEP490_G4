package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.StarRate;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStarRateOutputData;

import java.util.List;

public interface StarRateOutputBoundary {
    ListStarRateOutputData convertToListStarRateOutputData(List<StarRate> starRates);
}
