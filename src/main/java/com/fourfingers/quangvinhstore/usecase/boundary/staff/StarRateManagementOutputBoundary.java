package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.StarRate;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StarRateOutputData;

import java.util.List;

public interface StarRateManagementOutputBoundary {
    ListStarRateOutputData convertToListStarRateOutputData(List<StarRate> starRates);

    StarRateOutputData convertToStarRateOutputData(StarRate model, List<StarRate> staffReplies);
}
