package com.fourfingers.quangvinhstore.usecase.interactor.admin;

import com.fourfingers.quangvinhstore.infrastructure.repository.AccountRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.AccountEntity;
import com.fourfingers.quangvinhstore.usecase.boundary.admin.ResetPasswordStaffAccountInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.ResetPasswordStaffAccountInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Use case interaction class for handling staff account password reset operations
 *
 * @author LongLTHE170099
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ResetPasswordStaffAccountUseCaseInteraction implements ResetPasswordStaffAccountInputBoundary {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Resets the password for a staff account
     *
     * @param id                                 The ID of the staff account to reset password
     * @param resetPasswordStaffAccountInputData Data object containing old and new password information
     * @param userDetails                        Details of the user performing the password reset
     * @return true if password reset was successful
     * @throws RuntimeException if account not found or password doesn't match
     * @author LongLTHE170099
     */
    @Override
    public boolean resetPassword(Long id,
                                 ResetPasswordStaffAccountInputData resetPasswordStaffAccountInputData,
                                 UserDetails userDetails) {
        AccountEntity needToResetPasswordAccountEntity = accountRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        String enCodePassword = passwordEncoder.encode(resetPasswordStaffAccountInputData.getNewPassword());
        if(passwordEncoder.matches(resetPasswordStaffAccountInputData.getOldPassword(),
                needToResetPasswordAccountEntity.getPassword())) {
            needToResetPasswordAccountEntity.setPassword(enCodePassword);
            needToResetPasswordAccountEntity.setUpdatedBy((AccountEntity) userDetails);
            needToResetPasswordAccountEntity.setUpdatedAt(LocalDateTime.now());
            accountRepository.save(needToResetPasswordAccountEntity);
            return true;
        }
        throw new RuntimeException("Password not match");
    }
}
