package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import com.fourfingers.quangvinhstore.usecase.data.admin.ResetPasswordStaffAccountInputData;
import org.springframework.security.core.userdetails.UserDetails;

public interface ResetPasswordStaffAccountInputBoundary {
    boolean resetPassword(Long id,
                          ResetPasswordStaffAccountInputData resetPasswordStaffAccountInputData,
                          UserDetails userDetails);
}
