package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.SNSManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.admin.account.SNSInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/sns")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageSNSController {
    private final SNSManagementInputBoundary snsManagementInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllSNSs() {
        return ResponseEntity.ok(snsManagementInputBoundary.getAllSNSs());
    }

    @PostMapping
    public ResponseEntity<?> saveSNS(@RequestBody SNSInputData snsInputData) {
        return ResponseEntity.ok(snsManagementInputBoundary.save(snsInputData));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSNS(@PathVariable String id) {
        return ResponseEntity.ok(snsManagementInputBoundary.getSNS(id));
    }

//    @PutMapping
//    public ResponseEntity<?> updateSNS(@RequestBody SNSInputData snsInputData) {
//        return ResponseEntity.ok(snsManagementInputBoundary.save(snsInputData));
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSNS(@PathVariable String id,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(snsManagementInputBoundary.delete(id, userDetails));
    }
}
