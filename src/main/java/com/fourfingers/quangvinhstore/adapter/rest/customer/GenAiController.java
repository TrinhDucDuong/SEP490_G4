package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ChatWithAiInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.QuestionForAiInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chatbot")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class GenAiController {
    private final ChatWithAiInputBoundary chatWithAiInputBoundary;

    @PostMapping
    public ResponseEntity<?> chatWithAi(@RequestBody QuestionForAiInputData questionForAiInputData) {
        return ResponseEntity.ok(chatWithAiInputBoundary.getResponse(questionForAiInputData));
    }
}
