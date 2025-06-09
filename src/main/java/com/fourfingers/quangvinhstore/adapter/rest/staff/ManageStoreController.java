package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoreManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.store.StoreInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStoreController {
    private final StoreManagementInputBoundary storeManagementInputBoundary;

    @GetMapping("/store")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(storeManagementInputBoundary.getListStore());
    }

    @GetMapping("/store/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return ResponseEntity.ok(storeManagementInputBoundary.getStore(id));
    }

    @PostMapping("/store")
    public ResponseEntity<?> updateStore(@RequestBody StoreInputData manageStoreInputData) {
        return ResponseEntity.ok(storeManagementInputBoundary.save(null, manageStoreInputData));
    }

    @DeleteMapping("/store/{id}")
    public ResponseEntity<?> deleteStore(@PathVariable String id) {
        return ResponseEntity.ok(storeManagementInputBoundary.delete(id));
    }

    @PutMapping("/store/{id}")
    public ResponseEntity<?> updateStore(@PathVariable String id, @RequestBody StoreInputData manageStoreInputData) {
        return ResponseEntity.ok(storeManagementInputBoundary.save(id, manageStoreInputData));
    }
}
