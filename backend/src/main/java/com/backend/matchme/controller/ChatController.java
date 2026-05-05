package com.backend.matchme.controller;

import com.backend.matchme.dto.chat.ChatItemDTO;
import com.backend.matchme.dto.chat.ChatMsgDTO;
import com.backend.matchme.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public ResponseEntity<List<ChatItemDTO>> getChats(@AuthenticationPrincipal Long userId) {
        if (userId == null) {
            throw new RuntimeException("Unauthenticated");
        }
        return ResponseEntity.ok(chatService.getChats(userId));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<ChatMsgDTO>> getMessages(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "true") boolean markAsRead
    ) {
        return ResponseEntity.ok(chatService.getMessages(userId, id, page, size, markAsRead));
    }

    @PostMapping("/initiate/{receiverId}")
    public ResponseEntity<ChatItemDTO> initiateChat(@AuthenticationPrincipal Long userId, @PathVariable Long receiverId) {
        return ResponseEntity.ok(chatService.initiateChat(userId, receiverId));
    }
}
