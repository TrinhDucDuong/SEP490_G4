package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoreManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoreInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling store management operations for staff members.
 * Mapped to the "/staff" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStoreController {
    private final StoreManagementInputBoundary storeManagementInputBoundary;

    /**
     * Retrieves all stores from the system.
     *
     * @return ResponseEntity containing a list of all stores
     */
    @GetMapping("/store")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(storeManagementInputBoundary.getListStore());
    }

    /**
     * Retrieves a specific store by its ID.
     *
     * @param id The unique identifier of the store
     * @return ResponseEntity containing the requested store
     */
    @GetMapping("/store/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return ResponseEntity.ok(storeManagementInputBoundary.getStore(id));
    }

    /**
     * Creates a new store in the system.
     *
     * @param manageStoreInputData The store data to be saved
     * @param userDetails          The authenticated user details
     * @return ResponseEntity containing the created store
     */
    @PostMapping("/store")
    public ResponseEntity<?> updateStore(@RequestBody StoreInputData manageStoreInputData,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(storeManagementInputBoundary.save(null, manageStoreInputData, userDetails));
    }

    /**
     * Deletes a store from the system.
     *
     * @param id          The unique identifier of the store to delete
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the operation result
     */
    @DeleteMapping("/store/{id}")
    public ResponseEntity<?> deleteStore(@PathVariable String id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(storeManagementInputBoundary.delete(id, userDetails));
    }

    /**
     * Updates an existing store in the system.
     *
     * @param id                   The unique identifier of the store to update
     * @param manageStoreInputData The updated store data
     * @param userDetails          The authenticated user details
     * @return ResponseEntity containing the updated store
     */
    @PutMapping("/store/{id}")
    public ResponseEntity<?> updateStore(@PathVariable String id, @RequestBody StoreInputData manageStoreInputData,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(storeManagementInputBoundary.save(id, manageStoreInputData, userDetails));
    }
}
