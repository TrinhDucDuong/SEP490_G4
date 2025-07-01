package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.SNSAuthInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSAuthInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth-social")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSAuthenticationController {
    private final SNSAuthInputBoundary snsAuthInputBoundary;

    @GetMapping("/login/google")
    public ResponseEntity<?> loginWithGoogle(OAuth2AuthenticationToken token) {
        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
        snsAuthInputData.setEmail(token.getPrincipal().getAttribute("email"));
        snsAuthInputData.setName(token.getPrincipal().getAttribute("name"));
        AuthenticationOutputData authenticationOutputData = snsAuthInputBoundary
                .performGoogleAuthentication(snsAuthInputData);
        return ResponseEntity.ok(authenticationOutputData);
    }

    @GetMapping("/login/facebook")
    public ResponseEntity loginWithFacebook(OAuth2AuthenticationToken token) {
        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
        snsAuthInputData.setEmail(token.getPrincipal().getAttribute("id"));
        snsAuthInputData.setName(token.getPrincipal().getAttribute("name"));
        AuthenticationOutputData authenticationOutputData = snsAuthInputBoundary
                .performFacebookAuthentication(snsAuthInputData);
        return ResponseEntity.ok(authenticationOutputData);
    }

    @GetMapping("/password/verify")
    public String verifyAndReset(@RequestParam String contact) { // xử lý lại cho cả email và số điên thoai
        snsAuthInputBoundary.verifyCodeAndResetPassword(contact);
        return "Mã xác minh đã được gửi đến " + contact;
    }
}
