package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.usecase.data.customer.BannerOutputData;

import java.util.List;

public interface BannerOutputBoundary {
    BannerOutputData convertToBannerOutputData(List<Image> images);
}
