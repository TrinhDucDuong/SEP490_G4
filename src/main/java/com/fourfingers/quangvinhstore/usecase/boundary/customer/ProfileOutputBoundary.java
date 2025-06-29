package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Profile;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileOutputData;

public interface ProfileOutputBoundary {
    ProfileOutputData convertToProfileOutputData(Profile profile);
}
