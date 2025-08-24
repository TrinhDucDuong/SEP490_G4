package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.SNSInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling SNS (Social Networking Service) related operations.
 * Mapped to the "/sns" endpoint.
 *
 * @author DuongTDHE171824
 */
@RestController
@RequestMapping("/sns")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SNSController {
    private final SNSInputBoundary snsInputBoundary;

    /**
     * Retrieves all SNS information from the system.
     *
     * @return ResponseEntity containing a list of all SNS entries
     */
    @GetMapping
    public ResponseEntity<?> getAllSNSs() {
        return ResponseEntity.ok(snsInputBoundary.getAllSNSs());
    }
}
