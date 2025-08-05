package com.fourfingers.quangvinhstore.adapter.rest.admin.websocket;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.AiAssistantInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AiAssistanceWebSocketHandler extends TextWebSocketHandler {
    private final AiAssistantInputBoundary aiAssistantInputBoundary;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        aiAssistantInputBoundary.registerClient(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        aiAssistantInputBoundary.removeClient(session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        aiAssistantInputBoundary.handleVoice(session.getId(), message.getPayload());
    }
}
