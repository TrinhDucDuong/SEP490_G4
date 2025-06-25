package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.FeedbackInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class FeedbackController {
    private final FeedbackInputBoundary feedbackInputBoundary;

    @GetMapping
    private ResponseEntity<?> getAll() {
        return ResponseEntity.ok(feedbackInputBoundary.getAll());
    }
}
