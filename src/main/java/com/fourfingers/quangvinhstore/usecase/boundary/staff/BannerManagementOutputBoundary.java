package com.fourfingers.quangvinhstore.usecase.boundary.staff;


import com.fourfingers.quangvinhstore.domain.model.staff.Image;
import com.fourfingers.quangvinhstore.usecase.data.staff.BannerOutputData;

import java.util.List;

public interface BannerManagementOutputBoundary {
    BannerOutputData convertToBannerOutputData(List<Image> bannerImages);
}
