package com.fourfingers.quangvinhstore.usecase.boundary.customer;

import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.ProfileOutputData;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileInputBoundary {
    ProfileOutputData getProfile(UserDetails userDetails);

    ProfileOutputData update(ProfileInputData profileInputData, MultipartFile profileImage, UserDetails userDetails) throws Exception;
}
