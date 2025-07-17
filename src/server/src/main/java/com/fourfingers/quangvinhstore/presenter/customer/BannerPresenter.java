package com.fourfingers.quangvinhstore.presenter.customer;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.BannerOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.BannerOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BannerPresenter implements BannerOutputBoundary {
    @Override
    public BannerOutputData convertToBannerOutputData(List<Image> images) {
        return new BannerOutputData(images);
    }
}
