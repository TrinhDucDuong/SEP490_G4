package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.InstructionManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.InstructionInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
public class ManageInstructionController {
    private final InstructionManagementInputBoundary instructionManagementInputBoundary;

    @GetMapping("/instruction")
    public ResponseEntity<?> getAllInstruction() {
        return ResponseEntity.ok(instructionManagementInputBoundary.findAll());
    }

    @GetMapping("/instruction/{id}")
    public ResponseEntity<?> getInstructionById(@PathVariable String id) {
        return ResponseEntity.ok(instructionManagementInputBoundary.findById(id));
    }

    @PostMapping("/instruction")
    public ResponseEntity<?> saveInstruction(@RequestBody InstructionInputData inputData,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(instructionManagementInputBoundary.save(null, inputData, userDetails));
    }

    @PutMapping("/instruction/{id}")
    public ResponseEntity<?> updateInstruction(@PathVariable String id, @RequestBody InstructionInputData inputData,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(instructionManagementInputBoundary.save(id, inputData, userDetails));
    }

    @DeleteMapping("/instruction/{id}")
    public ResponseEntity<?> deleteInstruction(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(instructionManagementInputBoundary.delete(id, userDetails));
    }
}
