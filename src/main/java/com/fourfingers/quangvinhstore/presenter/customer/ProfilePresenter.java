package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Profile;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProfileOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileOutputData;
import org.springframework.stereotype.Component;

@Component
public class ProfilePresenter implements ProfileOutputBoundary {
    @Override
    public ProfileOutputData convertToProfileOutputData(Profile profile) {
        return new ProfileOutputData(profile);
    }
}
