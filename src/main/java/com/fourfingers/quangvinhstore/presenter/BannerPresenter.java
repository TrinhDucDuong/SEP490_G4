package com.fourfingers.quangvinhstore.presenter;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.usecase.boundary.BannerOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.output.banner.BannerOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BannerPresenter implements BannerOutputBoundary {
    @Override
    public BannerOutputData convertToBannerOutputData(List<Image> images) {
        return new BannerOutputData(images);
    }
}
