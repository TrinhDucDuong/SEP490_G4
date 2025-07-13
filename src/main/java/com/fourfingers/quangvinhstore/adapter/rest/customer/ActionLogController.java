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

@RestController
@RequestMapping("/action-log")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ActionLogController {
    private final ActionLogInputBoundary actionLogInputBoundary;

    @PostMapping
    public ResponseEntity<?> saveActionLog(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody ActionLogInputData actionLogInputData) {
        actionLogInputBoundary.logAction(actionLogInputData, userDetails);
        return ResponseEntity.noContent().build();
    }
}
