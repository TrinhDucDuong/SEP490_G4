package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.InstructionManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.InstructionInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling instruction management operations for staff members.
 * Mapped to the "/staff" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
public class ManageInstructionController {
    private final InstructionManagementInputBoundary instructionManagementInputBoundary;

    /**
     * Retrieves all instructions from the system.
     *
     * @return ResponseEntity containing a list of all instructions
     */
    @GetMapping("/instruction")
    public ResponseEntity<?> getAllInstruction() {
        return ResponseEntity.ok(instructionManagementInputBoundary.findAll());
    }

    /**
     * Retrieves a specific instruction by its ID.
     *
     * @param id The unique identifier of the instruction
     * @return ResponseEntity containing the requested instruction
     */
    @GetMapping("/instruction/{id}")
    public ResponseEntity<?> getInstructionById(@PathVariable String id) {
        return ResponseEntity.ok(instructionManagementInputBoundary.findById(id));
    }

    /**
     * Creates a new instruction in the system.
     *
     * @param inputData   The instruction data to be saved
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the saved instruction
     */
    @PostMapping("/instruction")
    public ResponseEntity<?> saveInstruction(@RequestBody InstructionInputData inputData,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(instructionManagementInputBoundary.save(null, inputData, userDetails));
    }

    /**
     * Updates an existing instruction in the system.
     *
     * @param id          The unique identifier of the instruction to update
     * @param inputData   The updated instruction data
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the updated instruction
     */
    @PutMapping("/instruction/{id}")
    public ResponseEntity<?> updateInstruction(@PathVariable String id, @RequestBody InstructionInputData inputData,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(instructionManagementInputBoundary.save(id, inputData, userDetails));
    }

    /**
     * Deletes an instruction from the system.
     *
     * @param id          The unique identifier of the instruction to delete
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the operation result
     */
    @DeleteMapping("/instruction/{id}")
    public ResponseEntity<?> deleteInstruction(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(instructionManagementInputBoundary.delete(id, userDetails));
    }
}
