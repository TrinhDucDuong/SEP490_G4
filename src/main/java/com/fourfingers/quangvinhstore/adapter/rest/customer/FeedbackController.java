package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.FeedbackInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * REST controller handling feedback-related operations.
 * Mapped to the "/feedback" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class FeedbackController {
    private final FeedbackInputBoundary feedbackInputBoundary;

    /**
     * Retrieves all feedback entries from the system.
     *
     * @return ResponseEntity containing a list of all feedback entries
     */
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(feedbackInputBoundary.getAll());
    }

    /**
     * Retrieves a specific feedback entry by its ID.
     *
     * @param id The unique identifier of the feedback entry
     * @return ResponseEntity containing the requested feedback entry
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(feedbackInputBoundary.getById(id));
    }
}
