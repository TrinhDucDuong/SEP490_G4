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

@RestController
@RequestMapping("/instruction")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class InstructionController {
    private final InstructionInputBoundary instructionInputBoundary;

    @GetMapping
    public ResponseEntity<?> getAllInstructions() {
        return ResponseEntity.ok(instructionInputBoundary.getListInstruction());
    }

    @RestController
    @RequestMapping("/store")
    @RequiredArgsConstructor(onConstructor_ = {@Autowired})
    public static class StoreController {
        private final StoreInputBoundary storeInputBoundary;
        @GetMapping
        public ResponseEntity<?> findAll() {
            return ResponseEntity.ok(storeInputBoundary.findAll());
        }

        @GetMapping("/{storeId}")
        public ResponseEntity<?> getStoreById(@PathVariable String storeId) {
            return ResponseEntity.ok(storeInputBoundary.findById(storeId));
        }
    }
}
