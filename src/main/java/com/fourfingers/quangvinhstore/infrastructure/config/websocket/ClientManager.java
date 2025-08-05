package com.fourfingers.quangvinhstore.infrastructure.config.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

@Component
public class ClientManager {
    private WebSocketSession session;

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public void clearSession() {
        this.session = null;
    }

    public void send(String base64Audio) {
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(base64Audio));
            } catch (IOException e) {
                // Ghi log nếu cần
            }
        }
    }
}
