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

/**
 * REST controller handling banner management operations for staff members.
 * Mapped to the "/staff/banner" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff/banner")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageBannerController {

    private final BannerManagementInputBoundary bannerManagementInputBoundary;

    /**
     * Retrieves all banners from the system.
     *
     * @return ResponseEntity containing banner information
     */
    @GetMapping
    public ResponseEntity<BannerOutputData> getAllBanners() {
        return ResponseEntity.ok(bannerManagementInputBoundary.findAll());
    }

    /**
     * Uploads new banner images to the system.
     *
     * @param bannerImages List of banner image files to upload
     * @return ResponseEntity containing the updated banner information
     * @throws Exception if there is an error processing the upload
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BannerOutputData> uploadBanner(@RequestPart List<MultipartFile> bannerImages) throws Exception {
        return ResponseEntity.ok(bannerManagementInputBoundary.addBanners(bannerImages));
    }

    /**
     * Updates the display configuration of banners.
     *
     * @param updateBannerInputData The banner configuration data to update
     * @return ResponseEntity containing the updated banner information
     */
    @PutMapping
    public ResponseEntity<BannerOutputData> setUpBanner(@RequestBody UpdateBannerInputData updateBannerInputData) {
        return ResponseEntity.ok(bannerManagementInputBoundary.updateBannerDisplay(updateBannerInputData));
    }
}
