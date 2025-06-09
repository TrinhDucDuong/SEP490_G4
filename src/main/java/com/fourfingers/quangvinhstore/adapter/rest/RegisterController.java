package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.RegisterInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.auth.RegisterInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class RegisterController {
    private final RegisterInputBoundary registerInputBoundary;
    @PostMapping("/register")
    public void register(@RequestBody RegisterInputData registerInputData) {

    }
}
