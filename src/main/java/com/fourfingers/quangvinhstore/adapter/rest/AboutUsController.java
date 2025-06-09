package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.AboutUsInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/about-us")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AboutUsController {
    private final AboutUsInputBoundary aboutUsInputBoundary;
    @GetMapping
    public ResponseEntity<?> showAboutUs() {
        return ResponseEntity.ok(aboutUsInputBoundary.showInformation());
    }
}
