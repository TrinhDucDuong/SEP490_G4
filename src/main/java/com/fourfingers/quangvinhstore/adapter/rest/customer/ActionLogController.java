package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ActionLogInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ActionLogInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling action log-related operations.
 * Mapped to the "/action-log" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/action-log")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ActionLogController {
    private final ActionLogInputBoundary actionLogInputBoundary;

    /**
     * Saves an action log entry for the authenticated user, used to recommend a product to the customer.
     *
     * @param userDetails        The authenticated user details
     * @param actionLogInputData The action log data to be saved
     * @return ResponseEntity with no content on successful save
     */
    @PostMapping
    public ResponseEntity<?> saveActionLog(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody ActionLogInputData actionLogInputData) {
        actionLogInputBoundary.logAction(actionLogInputData, userDetails);
        return ResponseEntity.noContent().build();
    }
}
