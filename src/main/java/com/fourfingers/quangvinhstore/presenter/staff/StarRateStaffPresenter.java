package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.StarRate;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.StarRateManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListStarRateOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.StarRateOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StarRateStaffPresenter implements StarRateManagementOutputBoundary {
    @Override
    public ListStarRateOutputData convertToListStarRateOutputData(List<StarRate> starRates) {
        return new ListStarRateOutputData(starRates);
    }

    @Override
    public StarRateOutputData convertToStarRateOutputData(StarRate model, List<StarRate> staffReplies) {
        return new StarRateOutputData(model, staffReplies);
    }
}
