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

@RestController
@RequestMapping("/staff/feedback")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageFeedbackController {
    private final FeedbackManagementInputBoundary feedBackManagementInputBoundary;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@RequestPart List<MultipartFile> feedbackImages,
                                    @RequestPart FeedbackInputData feedbackInputData,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(feedBackManagementInputBoundary.create(feedbackInputData, feedbackImages, userDetails));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(feedBackManagementInputBoundary.getAll());
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, value = "/{id}")
    public ResponseEntity<?> update(@RequestPart List<MultipartFile> feedbackImages,
                                    @RequestPart FeedbackInputData feedbackInputData,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable String id) throws Exception {
        return ResponseEntity.ok(feedBackManagementInputBoundary.update(id, feedbackInputData, feedbackImages, userDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(feedBackManagementInputBoundary.delete(id, userDetails));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> unDelete(@PathVariable String id,
                                      @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(feedBackManagementInputBoundary.unDelete(id, userDetails));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedback(@PathVariable String id) {
        return ResponseEntity.ok(feedBackManagementInputBoundary.get(id));
    }
}
