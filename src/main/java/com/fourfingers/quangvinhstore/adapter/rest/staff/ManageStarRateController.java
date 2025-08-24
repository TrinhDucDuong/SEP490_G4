package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.StarRateManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ReplyStarRateInputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.UpdateStarRateInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling staff operations for star rate management.
 * Mapped to the "/staff/star-rate" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff/star-rate")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStarRateController {
    private final StarRateManagementInputBoundary starRateManagementInputBoundary;

    /**
     * Retrieves all star rates from the system.
     *
     * @return ResponseEntity containing a list of all star rates
     */
    @GetMapping
    public ResponseEntity<?> getAllStarRates() {
        return ResponseEntity.ok(starRateManagementInputBoundary.getAll());
    }

    /**
     * Adds a staff reply to a customer's star rate.
     *
     * @param replyStarRateInputData The reply data to be added
     * @param userDetails            The authenticated staff user details
     * @return ResponseEntity containing the updated star rate with reply
     */
    @PostMapping
    public ResponseEntity<?> replyToCustomerStarRate(@RequestBody ReplyStarRateInputData replyStarRateInputData,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(starRateManagementInputBoundary.reply(replyStarRateInputData, userDetails));
    }

    /**
     * Retrieves a specific star rate by its ID.
     *
     * @param id The unique identifier of the star rate
     * @return ResponseEntity containing the requested star rate
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        return ResponseEntity.ok(starRateManagementInputBoundary.get(id));
    }

    /**
     * Disables a specific star rate.
     *
     * @param id          The unique identifier of the star rate to disable
     * @param userDetails The authenticated staff user details
     * @return ResponseEntity containing the disabled star rate
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> disable(@PathVariable String id,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(starRateManagementInputBoundary.disable(id, userDetails));
    }

    /**
     * Re-enables a previously disabled star rate.
     *
     * @param id          The unique identifier of the star rate to re-enable
     * @param userDetails The authenticated staff user details
     * @return ResponseEntity containing the re-enabled star rate
     */
    @PatchMapping("/{id}")
    public ResponseEntity<?> unDisable(@PathVariable String id,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(starRateManagementInputBoundary.unDisable(id, userDetails));
    }

    /**
     * Updates a specific star rate.
     *
     * @param id                      The unique identifier of the star rate to update
     * @param userDetails             The authenticated staff user details
     * @param updateStarRateInputData The updated star rate data
     * @return ResponseEntity containing the updated star rate
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    @RequestBody UpdateStarRateInputData updateStarRateInputData) {
        return ResponseEntity.ok(starRateManagementInputBoundary.update(id, userDetails, updateStarRateInputData));
    }
}
