package com.fourfingers.quangvinhstore.usecase.boundary;

import com.fourfingers.quangvinhstore.usecase.data.input.AuthenticationInputData;
import com.fourfingers.quangvinhstore.usecase.data.output.AuthenticationOutputData;

public interface AuthenticationInputBoundary {
    AuthenticationOutputData performAuthentication(AuthenticationInputData data);
}