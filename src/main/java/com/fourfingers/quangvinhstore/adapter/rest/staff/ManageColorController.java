package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.ColorManagementInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller handling color management operations for staff.
 * Mapped to the "/staff/color" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff/color")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageColorController {
    private final ColorManagementInputBoundary colorManagementInputBoundary;

    /**
     * Retrieves all color information from the system.
     *
     * @return ResponseEntity containing a list of all colors
     */
    @GetMapping
    public ResponseEntity<?> getAllColors() {
        return ResponseEntity.ok(colorManagementInputBoundary.findAll());
    }
}
