package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.LandingPageInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class LandingPageController {
    private final LandingPageInputBoundary landingPageInputBoundary;

    @GetMapping
    public ResponseEntity<?> showLandingPage() {
        return ResponseEntity.ok(landingPageInputBoundary.showLandingPage());
    }
}
