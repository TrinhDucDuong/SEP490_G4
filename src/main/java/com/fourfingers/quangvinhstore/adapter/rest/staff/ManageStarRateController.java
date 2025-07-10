package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.StarRateManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ReplyStarRateInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff/star-rate")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStarRateController {
    private final StarRateManagementInputBoundary starRateManagementInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllStarRates() {
        return ResponseEntity.ok(starRateManagementInputBoundary.getAll());
    }

    @PostMapping
    public ResponseEntity<?> replyToCustomerStarRate(@RequestBody ReplyStarRateInputData replyStarRateInputData,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(starRateManagementInputBoundary.reply(replyStarRateInputData, userDetails));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        return ResponseEntity.ok(starRateManagementInputBoundary.get(id));
    }
}
