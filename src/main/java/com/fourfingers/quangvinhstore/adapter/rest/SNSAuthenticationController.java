package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.SNSAuthInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSAuthInputData;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;

/**
 * REST controller for handling social network authentication and password reset operations.
 * Provides endpoints for OAuth2 authentication with Google and Facebook,
 * as well as password reset functionality.
 *
 * @author DuongTDHE171824
 */
@RestController
@RequestMapping("/auth/social")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSAuthenticationController {
    /**
     * Input boundary for social network authentication operations.
     */
    private final SNSAuthInputBoundary snsAuthInputBoundary;

    /**
     * Handles Google OAuth2 authentication and redirects to frontend application.
     *
     * @param token    OAuth2 authentication token from Google
     * @param response HTTP response for redirect
     * @throws IOException if redirect operation fails
     */
    @GetMapping("/google")
    public void loginWithGoogle(OAuth2AuthenticationToken token, HttpServletResponse response) throws IOException {
        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
        snsAuthInputData.setToken(token);
        AuthenticationOutputData authenticationOutputData = snsAuthInputBoundary
                .performGoogleAuthentication(snsAuthInputData);

        String jwtToken = authenticationOutputData.getToken();
        Long accountId = authenticationOutputData.getAccount().getAccountId();
        String username = authenticationOutputData.getAccount().getUsername();

        String redirectUrl = "https://quangvinh.store/oauth2/redirect" +
                "?token=" + jwtToken +
                "&accountId=" + accountId +
                "&username=" + username;

        response.sendRedirect(redirectUrl);
    }

    /**
     * Handles Facebook OAuth2 authentication.
     *
     * @param token OAuth2 authentication token from Facebook
     * @return ResponseEntity containing authentication result data
     */
    @GetMapping(value = "/facebook", produces = "application/json")
    public ResponseEntity<?> loginWithFacebook(OAuth2AuthenticationToken token) {
        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
        snsAuthInputData.setToken(token);
        AuthenticationOutputData authenticationOutputData = snsAuthInputBoundary
                .performFacebookAuthentication(snsAuthInputData);
        return ResponseEntity.ok(authenticationOutputData);
    }

    /**
     * Initiates password reset process by sending verification code.
     *
     * @param contact User's contact information (email/phone)
     * @return Message confirming verification code delivery
     */
    @GetMapping("/forgot")
    public String resetPassword(@RequestParam String contact) {
        snsAuthInputBoundary.resetPassword(contact);
        return "Mã xác minh đã được gửi đến " + contact;
    }

    /**
     * Completes password reset process using verification token.
     *
     * @param contact User's contact information (email/phone)
     * @param token   Verification token for password reset
     * @return Message confirming password reset completion
     */
    @GetMapping("/reset")
    public String processResetPassword(@RequestParam String contact, String token) {
        snsAuthInputBoundary.processResetPassword(contact, token);
        return "Mật khẩu mới đã được gửi đến " + contact;
    }

}
