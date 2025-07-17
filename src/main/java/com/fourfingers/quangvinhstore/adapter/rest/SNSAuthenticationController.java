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

@RestController
@RequestMapping("/auth/social")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSAuthenticationController {
    private final SNSAuthInputBoundary snsAuthInputBoundary;

//    @GetMapping("/google")
//    @GetMapping(value = "/google", produces = "application/json")
//    public ResponseEntity<?> loginWithGoogle(OAuth2AuthenticationToken token) {
//        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
//        snsAuthInputData.setToken(token);
//        AuthenticationOutputData authenticationOutputData = snsAuthInputBoundary
//                .performGoogleAuthentication(snsAuthInputData);
//        return ResponseEntity.ok(authenticationOutputData);
//    }
    @GetMapping("/google")
    public void loginWithGoogle(OAuth2AuthenticationToken token, HttpServletResponse response) throws IOException {
        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
        snsAuthInputData.setToken(token);
        AuthenticationOutputData authenticationOutputData = snsAuthInputBoundary
                .performGoogleAuthentication(snsAuthInputData);

        // Chuẩn bị URL để redirect về frontend
        String jwtToken = authenticationOutputData.getToken();
        Long accountId = authenticationOutputData.getAccount().getAccountId();
        String username = authenticationOutputData.getAccount().getUsername();

        String redirectUrl = "http://localhost:5173/oauth2/redirect" +
                "?token=" + jwtToken +
                "&accountId=" + accountId +
                "&username=" + username;

        response.sendRedirect(redirectUrl);
    }

//    @GetMapping("/facebook")
    @GetMapping(value = "/facebook", produces = "application/json")
    public ResponseEntity<?> loginWithFacebook(OAuth2AuthenticationToken token) {
        SNSAuthInputData snsAuthInputData = new SNSAuthInputData();
        snsAuthInputData.setToken(token);
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
