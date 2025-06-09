package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.InstructionInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/instruction")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class InstructionController {
    private final InstructionInputBoundary instructionInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllInstructions() {
        return ResponseEntity.ok(instructionInputBoundary.getListInstruction());
    }
}
