package com.backend.matchme.controller;

import com.backend.matchme.dto.chat.ChatItemDTO;
import com.backend.matchme.dto.chat.ChatMsgDTO;
import com.backend.matchme.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public ResponseEntity<List<ChatItemDTO>> getChats(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(chatService.getChats(userId));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<ChatMsgDTO>> getMessages(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(chatService.getMessages(userId, id, page, size));
    }
}
