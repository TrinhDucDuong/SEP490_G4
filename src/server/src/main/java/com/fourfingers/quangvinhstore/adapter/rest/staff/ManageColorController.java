package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.ColorManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staff/color")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageColorController {
    private final ColorManagementInputBoundary colorManagementInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllColors() {
        return ResponseEntity.ok(colorManagementInputBoundary.findAll());
    }
}
