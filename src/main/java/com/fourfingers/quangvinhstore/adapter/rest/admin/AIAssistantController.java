package com.fourfingers.quangvinhstore.adapter.rest.admin;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.AiAssistantInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/ai-assistance")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AIAssistantController {
    private final AiAssistantInputBoundary aiAssistantInputBoundary;

    @GetMapping
    public ResponseEntity<?> ask(@RequestParam String question) {
        aiAssistantInputBoundary.getAnswer(question);
        return ResponseEntity.noContent().build();
    }
}
