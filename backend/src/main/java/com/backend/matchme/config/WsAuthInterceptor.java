package com.backend.matchme.config;

import com.backend.matchme.security.JwtService;
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
    private final JwtService jwtService;

    public WsAuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String jwt = token(accessor);
            Long userId = jwtService.extractUserId(jwt);
            accessor.setUser(new UsernamePasswordAuthenticationToken(
                    userId,
                    null,
                    Collections.emptyList()
            ));
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
