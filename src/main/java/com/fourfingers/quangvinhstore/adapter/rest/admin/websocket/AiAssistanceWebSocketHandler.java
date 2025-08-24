package com.fourfingers.quangvinhstore.adapter.rest.admin.websocket;

import com.fourfingers.quangvinhstore.usecase.boundary.admin.AiAssistantInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * WebSocket handler for AI assistance functionality.
 * Manages WebSocket connections and message handling for AI voice assistant features.
 *
 * @author LongLTHE170099
 */
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AiAssistanceWebSocketHandler extends TextWebSocketHandler {
    private final AiAssistantInputBoundary aiAssistantInputBoundary;

    /**
     * Handles new WebSocket connection establishment.
     * Registers the client session with the AI assistant system.
     *
     * @param session The WebSocket session that is being established
     * @throws Exception If there is an error during connection establishment
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        aiAssistantInputBoundary.registerClient(session);
    }

    /**
     * Handles WebSocket connection closure.
     * Removes the client from the AI assistant system.
     *
     * @param session The WebSocket session that is being closed
     * @param status  The status indicating why the connection was closed
     * @throws Exception If there is an error during connection closure
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        aiAssistantInputBoundary.removeClient(session.getId());
    }

    /**
     * Handles incoming text messages from the WebSocket connection.
     * Processes voice data received from the client.
     *
     * @param session The WebSocket session that received the message
     * @param message The text message containing voice data
     * @throws Exception If there is an error processing the message
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        aiAssistantInputBoundary.handleVoice(session.getId(), message.getPayload());
    }
}
