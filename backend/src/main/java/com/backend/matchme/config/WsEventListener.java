package com.backend.matchme.config;

import com.backend.matchme.service.PresenceService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WsEventListener {
    private final PresenceService presenceService;

    public WsEventListener(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @EventListener
    public void onConnect(SessionConnectedEvent event) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(event.getMessage());
        if (acc.getUser() instanceof UsernamePasswordAuthenticationToken auth
            && auth.getPrincipal() instanceof Long userId) {
            presenceService.on(userId, acc.getSessionId());
        }
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(event.getMessage());
        if (acc.getUser() instanceof UsernamePasswordAuthenticationToken auth
            && auth.getPrincipal() instanceof Long userId) {
            presenceService.off(userId, acc.getSessionId());
        }
    }
}
