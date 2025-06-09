package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.usecase.data.input.auth.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.auth.AuthenticationOutputData;

public interface AuthenticationInputBoundary {
    AuthenticationOutputData performAuthentication(AuthenticationInputData data);
}