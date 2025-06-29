package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProfileInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProfileController {
    private final ProfileInputBoundary profileInputBoundary;

    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileInputBoundary.getProfile(userDetails));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestPart ProfileInputData profileInputData,
                                           @RequestPart MultipartFile profileImage) throws Exception {
        return ResponseEntity.ok(profileInputBoundary.update(profileInputData, profileImage, userDetails));
    }
}
