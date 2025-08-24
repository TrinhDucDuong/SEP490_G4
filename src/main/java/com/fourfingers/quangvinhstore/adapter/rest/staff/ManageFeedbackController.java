package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.FeedbackManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.FeedbackInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller handling staff feedback management operations.
 * Mapped to the "/staff/feedback" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff/feedback")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageFeedbackController {
    private final FeedbackManagementInputBoundary feedBackManagementInputBoundary;

    /**
     * Creates a new feedback entry with images.
     *
     * @param feedbackImages    List of images attached to the feedback
     * @param feedbackInputData The feedback data to be created
     * @param userDetails       The authenticated user details
     * @return ResponseEntity containing the created feedback
     * @throws Exception if creation fails
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@RequestPart List<MultipartFile> feedbackImages,
                                    @RequestPart FeedbackInputData feedbackInputData,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(feedBackManagementInputBoundary.create(feedbackInputData, feedbackImages, userDetails));
    }

    /**
     * Retrieves all feedback entries from the system.
     *
     * @return ResponseEntity containing a list of all feedback entries
     */
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(feedBackManagementInputBoundary.getAll());
    }

    /**
     * Updates an existing feedback entry.
     *
     * @param feedbackImages    Updated list of feedback images
     * @param feedbackInputData Updated feedback data
     * @param userDetails       The authenticated user details
     * @param id                The ID of the feedback to update
     * @return ResponseEntity containing the updated feedback
     * @throws Exception if update fails
     */
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, value = "/{id}")
    public ResponseEntity<?> update(@RequestPart List<MultipartFile> feedbackImages,
                                    @RequestPart FeedbackInputData feedbackInputData,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable String id) throws Exception {
        return ResponseEntity.ok(feedBackManagementInputBoundary.update(id, feedbackInputData, feedbackImages, userDetails));
    }

    /**
     * Deletes a feedback entry by ID.
     *
     * @param id          The ID of the feedback to delete
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the deletion result
     * @throws Exception if deletion fails
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(feedBackManagementInputBoundary.delete(id, userDetails));
    }

    /**
     * Restores a previously deleted feedback entry.
     *
     * @param id          The ID of the feedback to restore
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the restored feedback
     * @throws Exception if restoration fails
     */
    @PatchMapping("/{id}")
    public ResponseEntity<?> unDelete(@PathVariable String id,
                                      @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(feedBackManagementInputBoundary.unDelete(id, userDetails));
    }

    /**
     * Retrieves a specific feedback entry by its ID.
     *
     * @param id The ID of the feedback to retrieve
     * @return ResponseEntity containing the requested feedback
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedback(@PathVariable String id) {
        return ResponseEntity.ok(feedBackManagementInputBoundary.get(id));
    }
}
