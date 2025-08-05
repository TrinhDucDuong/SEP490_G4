package com.fourfingers.quangvinhstore.infrastructure.config.websocket;

import com.fourfingers.quangvinhstore.adapter.rest.admin.websocket.AiAssistanceWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final AiAssistanceWebSocketHandler aiAssistanceWebSocketHandler;

    public WebSocketConfig(AiAssistanceWebSocketHandler aiAssistanceWebSocketHandler) {
        this.aiAssistanceWebSocketHandler = aiAssistanceWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(aiAssistanceWebSocketHandler, "/admin/ai-assistant")
                .setAllowedOrigins("*");
    }
}
