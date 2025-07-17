package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.StarRate;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StarRateOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ListStarRateOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StarRatePresenter implements StarRateOutputBoundary {
    @Override
    public ListStarRateOutputData convertToListStarRateOutputData(List<StarRate> starRates) {
        return new ListStarRateOutputData(starRates);
    }
}
