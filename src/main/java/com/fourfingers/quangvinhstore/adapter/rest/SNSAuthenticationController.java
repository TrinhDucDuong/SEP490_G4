package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.SNSAuthInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSAuthInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/social")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSAuthenticationController {
    private final SNSAuthInputBoundary snsAuthInputBoundary;

    @GetMapping("/google")
    public ResponseEntity<?> loginWithGoogle(OAuth2AuthenticationToken token) {
        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
        snsAuthInputData.setEmail(token.getPrincipal().getAttribute("email"));
        snsAuthInputData.setName(token.getPrincipal().getAttribute("name"));
        AuthenticationOutputData authenticationOutputData = snsAuthInputBoundary
                .performGoogleAuthentication(snsAuthInputData);
        return ResponseEntity.ok(authenticationOutputData);
    }

    @GetMapping("/facebook")
    public ResponseEntity loginWithFacebook(OAuth2AuthenticationToken token) {
        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
        snsAuthInputData.setEmail(token.getPrincipal().getAttribute("id"));
        snsAuthInputData.setName(token.getPrincipal().getAttribute("name"));
        AuthenticationOutputData authenticationOutputData = snsAuthInputBoundary
                .performFacebookAuthentication(snsAuthInputData);
        return ResponseEntity.ok(authenticationOutputData);
    }

    @GetMapping("/forgot")
    public String resetPassword(@RequestParam String contact) { //TODO: xử lý thêm cho số điên thoai
        snsAuthInputBoundary.resetPassword(contact);
        return "Mã xác minh đã được gửi đến " + contact;
    }

    @GetMapping("/reset")
    public String processResetPassword(@RequestParam String contact, String token) { //TODO: xử lý thêm cho số điên thoai
        snsAuthInputBoundary.processResetPassword(contact, token);
        return "Mật khẩu mới đã được gửi đến " + contact;
    }

}
