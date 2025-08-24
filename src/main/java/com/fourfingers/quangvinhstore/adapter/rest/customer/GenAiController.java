package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ChatWithAiInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.ChatBotHistoryInputData;
import com.fourfingers.quangvinhstore.usecase.data.customer.QuestionForAiInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * REST controller handling AI chatbot-related operations.
 * Mapped to the "/chatbot" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/chatbot")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class GenAiController {
    private final ChatWithAiInputBoundary chatWithAiInputBoundary;

    /**
     * Processes a new chat interaction with the AI system.
     *
     * @param questionForAiInputData The input data containing the user's question
     * @return ResponseEntity containing the AI's response
     */
    @PostMapping("/new")
    public ResponseEntity<?> chatWithAi(@RequestBody QuestionForAiInputData questionForAiInputData) {
        return ResponseEntity.ok(chatWithAiInputBoundary.getResponse(questionForAiInputData));
    }

    /**
     * Processes a chat interaction with the AI system including conversation history.
     *
     * @param chatBotHistoryInputData The input data containing the conversation history
     * @return ResponseEntity containing the AI's response based on history
     */
    @PostMapping("/history")
    public ResponseEntity<?> chatWithAiContainsHistory(@RequestBody ChatBotHistoryInputData chatBotHistoryInputData) {
        return null;
    }
}
