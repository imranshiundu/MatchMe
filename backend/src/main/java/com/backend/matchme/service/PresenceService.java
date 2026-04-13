package com.backend.matchme.service;

import com.backend.matchme.dto.chat.PresenceDTO;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService {
    private final ConcurrentHashMap<Long, Set<String>> sessions = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    public PresenceService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public boolean isOnline(Long userId) {
        return sessions.containsKey(userId) && !sessions.get(userId).isEmpty();
    }

    public void on(Long userId, String sessionId) {
        sessions.computeIfAbsent(userId, key -> ConcurrentHashMap.newKeySet()).add(sessionId);
        push(userId);
    }

    public void off(Long userId, String sessionId) {
        Set<String> ids = sessions.get(userId);
        if (ids == null) {
            return;
        }
        ids.remove(sessionId);
        if (ids.isEmpty()) {
            sessions.remove(userId);
        }
        push(userId);
    }

    private void push(Long userId) {
        messagingTemplate.convertAndSend("/topic/presence/" + userId, new PresenceDTO(userId, isOnline(userId)));
    }
}
