package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.InstructionInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.customer.StoreInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * REST controller handling instruction-related operations.
 * Mapped to the "/instruction" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/instruction")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class InstructionController {
    private final InstructionInputBoundary instructionInputBoundary;

    /**
     * Retrieves all instruction information from the system.
     *
     * @return ResponseEntity containing a list of all instructions
     */
    @GetMapping
    public ResponseEntity<?> getAllInstructions() {
        return ResponseEntity.ok(instructionInputBoundary.getListInstruction());
    }
}
