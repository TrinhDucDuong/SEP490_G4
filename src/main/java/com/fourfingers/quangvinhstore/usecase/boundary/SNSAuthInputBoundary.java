package com.fourfingers.quangvinhstore.usecase.boundary;


import com.fourfingers.quangvinhstore.usecase.data.auth.AuthenticationOutputData;
import com.fourfingers.quangvinhstore.usecase.data.auth.SNSAuthInputData;

public interface SNSAuthInputBoundary {
    AuthenticationOutputData performGoogleAuthentication(SNSAuthInputData data);

    AuthenticationOutputData performFacebookAuthentication(SNSAuthInputData data);

    void resetPassword(String email);

    void processResetPassword(String contact, String token);
}