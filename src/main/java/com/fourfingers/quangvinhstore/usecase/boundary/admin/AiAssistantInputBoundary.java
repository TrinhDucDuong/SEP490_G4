package com.fourfingers.quangvinhstore.usecase.boundary.admin;

import org.springframework.web.socket.WebSocketSession;

public interface AiAssistantInputBoundary {

    void registerClient(WebSocketSession session);

    void removeClient(String id);

    void handleVoice(String id, String payload);
}
