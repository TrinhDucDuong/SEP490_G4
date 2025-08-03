package com.fourfingers.quangvinhstore.presenter.staff;

import com.fourfingers.quangvinhstore.domain.model.staff.Image;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BannerManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BannerOutputData;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BannerStaffPresenter implements BannerManagementOutputBoundary {
    @Override
    public BannerOutputData convertToBannerOutputData(List<Image> bannerImages) {
        return new BannerOutputData(bannerImages);
    }
}
