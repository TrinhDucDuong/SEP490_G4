package com.fourfingers.quangvinhstore.usecase.boundary;


import com.fourfingers.quangvinhstore.usecase.data.auth.RegisterInputData;

public interface RegisterInputBoundary {

    String registerAccount(RegisterInputData registerInputData);
}
