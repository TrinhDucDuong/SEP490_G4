package com.fourfingers.quangvinhstore.usecase.boundary.staff;

import com.fourfingers.quangvinhstore.usecase.data.staff.BannerOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.UpdateBannerInputData;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BannerManagementInputBoundary {
    BannerOutputData findAll();
    BannerOutputData addBanners(List<MultipartFile> bannerImages) throws Exception;
    BannerOutputData updateBannerDisplay(UpdateBannerInputData updateBannerInputData);
}
