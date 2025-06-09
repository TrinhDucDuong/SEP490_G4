package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.StoryManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.input.story.StoryInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageStoryController {
    private final StoryManagementInputBoundary storyManagementInputBoundary;

    @GetMapping("/story")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(storyManagementInputBoundary.getAllStory());
    }

    @GetMapping("/story/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        return ResponseEntity.ok(storyManagementInputBoundary.getStory(id));
    }

    @PostMapping("/story")
    public ResponseEntity<?> addStory(@RequestBody StoryInputData storyInputData) {
        return ResponseEntity.ok(storyManagementInputBoundary.saveStory(null, storyInputData));
    }

    @PutMapping("/story/{id}")
    public ResponseEntity<?> updateStory(@PathVariable String id, @RequestBody StoryInputData storyInputData) {
        return ResponseEntity.ok(storyManagementInputBoundary.saveStory(id, storyInputData));
    }

    @DeleteMapping("/story/{id}")
    public ResponseEntity<?> deleteStory(@PathVariable String id) {
        return ResponseEntity.ok(storyManagementInputBoundary.deleteStory(id));
    }
}
