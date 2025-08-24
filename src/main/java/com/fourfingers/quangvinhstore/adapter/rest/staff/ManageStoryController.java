package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoryManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.StoryInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling staff story management operations.
 * Mapped to the "/staff" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStoryController {
    private final StoryManagementInputBoundary storyManagementInputBoundary;

    /**
     * Retrieves all stories from the system.
     *
     * @return ResponseEntity containing a list of all stories
     */
    @GetMapping("/story")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(storyManagementInputBoundary.getAllStory());
    }

    /**
     * Retrieves a specific story by its ID.
     *
     * @param id The unique identifier of the story
     * @return ResponseEntity containing the requested story
     */
    @GetMapping("/story/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return ResponseEntity.ok(storyManagementInputBoundary.getStory(id));
    }

    /**
     * Creates a new story in the system.
     *
     * @param storyInputData The story data to be created
     * @return ResponseEntity containing the created story
     */
    @PostMapping("/story")
    public ResponseEntity<?> addStory(@RequestBody StoryInputData storyInputData) {
        return ResponseEntity.ok(storyManagementInputBoundary.saveStory(null, storyInputData));
    }

    /**
     * Updates an existing story in the system.
     *
     * @param id             The unique identifier of the story to update
     * @param storyInputData The updated story data
     * @return ResponseEntity containing the updated story
     */
    @PutMapping("/story/{id}")
    public ResponseEntity<?> updateStory(@PathVariable String id, @RequestBody StoryInputData storyInputData) {
        return ResponseEntity.ok(storyManagementInputBoundary.saveStory(id, storyInputData));
    }

    /**
     * Deletes a story from the system.
     *
     * @param id The unique identifier of the story to delete
     * @return ResponseEntity containing the operation result
     */
    @DeleteMapping("/story/{id}")
    public ResponseEntity<?> deleteStory(@PathVariable String id) {
        return ResponseEntity.ok(storyManagementInputBoundary.deleteStory(id));
    }
}
