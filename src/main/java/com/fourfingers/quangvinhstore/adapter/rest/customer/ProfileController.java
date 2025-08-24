package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProfileInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST controller handling user profile-related operations.
 * Mapped to the "/profile" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProfileController {
    private final ProfileInputBoundary profileInputBoundary;

    /**
     * Retrieves the profile information for the authenticated user.
     *
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the user's profile information
     */
    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileInputBoundary.getProfile(userDetails));
    }

    /**
     * Updates the profile information for the authenticated user.
     *
     * @param userDetails      The authenticated user details
     * @param profileInputData The profile data to be updated
     * @param profileImage     Optional profile image file
     * @return ResponseEntity containing the updated profile information
     * @throws Exception If there is an error processing the profile update
     */
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestPart ProfileInputData profileInputData,
                                           @RequestPart (required = false) MultipartFile profileImage) throws Exception {
        return ResponseEntity.ok(profileInputBoundary.update(profileInputData, profileImage, userDetails));
    }
}
