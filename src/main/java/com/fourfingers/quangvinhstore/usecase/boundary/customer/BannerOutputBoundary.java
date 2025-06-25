package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.domain.model.customer.Image;
import com.fourfingers.quangvinhstore.usecase.data.output.banner.BannerOutputData;

import java.util.List;

public interface BannerOutputBoundary {
    BannerOutputData convertToBannerOutputData(List<Image> images);
}
