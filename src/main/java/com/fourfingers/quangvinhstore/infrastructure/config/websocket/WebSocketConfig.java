package com.fourfingers.quangvinhstore.infrastructure.config.websocket;

import com.fourfingers.quangvinhstore.adapter.rest.admin.websocket.AiAssistanceWebSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
@Profile("!test")
public class WebSocketConfig implements WebSocketConfigurer {
    private final AiAssistanceWebSocketHandler aiAssistanceWebSocketHandler;

    public WebSocketConfig(AiAssistanceWebSocketHandler aiAssistanceWebSocketHandler) {
        this.aiAssistanceWebSocketHandler = aiAssistanceWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(aiAssistanceWebSocketHandler, "/admin/ai-assistant")
                .addHandler(aiAssistanceWebSocketHandler, "/admin/ai-assistant/**")
                .setAllowedOrigins("*");
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(2000 * 1024);
        container.setMaxBinaryMessageBufferSize(2000 * 1024);
        return container;
    }

}
