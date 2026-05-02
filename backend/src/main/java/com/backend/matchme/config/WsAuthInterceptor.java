package com.backend.matchme.config;

import com.backend.matchme.service.AuthService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class WsAuthInterceptor implements ChannelInterceptor {
    private final AuthService authService;

    public WsAuthInterceptor(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String jwt = token(accessor);
            Long userId = authService.extractUserId(jwt);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid socket token");
            }
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    Collections.emptyList()
            );
            accessor.setUser(authToken);
            accessor.getSessionAttributes().put("userId", userId);
        }
        return message;
    }

    private String token(StompHeaderAccessor accessor) {
        List<String> auth = accessor.getNativeHeader("Authorization");
        if (auth != null && !auth.isEmpty()) {
            String value = auth.get(0);
            return value.startsWith("Bearer ") ? value.substring(7) : value;
        }

        List<String> token = accessor.getNativeHeader("token");
        if (token != null && !token.isEmpty()) {
            return token.get(0);
        }

        throw new IllegalArgumentException("Missing socket token");
    }
}
