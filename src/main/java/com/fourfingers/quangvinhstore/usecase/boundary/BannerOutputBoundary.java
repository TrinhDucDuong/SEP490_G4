package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.usecase.data.output.banner.BannerOutputData;

import java.util.List;

public interface BannerOutputBoundary {
    BannerOutputData convertToBannerOutputData(List<Image> images);
}
