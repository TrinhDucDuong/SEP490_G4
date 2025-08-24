package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.BannerInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling banner-related operations.
 * Mapped to the "/banner" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/banner")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BannerController {
    private final BannerInputBoundary bannerInputBoundary;

    /**
     * Retrieves all banner information from the system.
     *
     * @return ResponseEntity containing a list of all banners
     */
    @GetMapping
    public ResponseEntity<?> getAllBanners() {
        return ResponseEntity.ok(bannerInputBoundary.getAll());
    }
}
