package com.fourfingers.quangvinhstore.adapter.rest.staff;


import com.fourfingers.quangvinhstore.usecase.boundary.staff.BannerManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BannerOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.UpdateBannerInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/staff/banner")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageBannerController {

    private final BannerManagementInputBoundary bannerManagementInputBoundary;

    @GetMapping
    public ResponseEntity<BannerOutputData> getAllBanners() {
        return ResponseEntity.ok(bannerManagementInputBoundary.findAll());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BannerOutputData> uploadBanner(@RequestPart List<MultipartFile> bannerImages) throws Exception {
        return ResponseEntity.ok(bannerManagementInputBoundary.addBanners(bannerImages));
    }

    @PutMapping
    public ResponseEntity<BannerOutputData> setUpBanner(@RequestBody UpdateBannerInputData updateBannerInputData) {
        return ResponseEntity.ok(bannerManagementInputBoundary.updateBannerDisplay(updateBannerInputData));
    }
}
