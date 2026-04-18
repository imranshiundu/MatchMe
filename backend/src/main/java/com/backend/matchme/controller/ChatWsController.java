package com.backend.matchme.controller;

import com.backend.matchme.dto.chat.ChatSendDTO;
import com.backend.matchme.dto.chat.TypingDTO;
import com.backend.matchme.dto.chat.TypingEventDTO;
import com.backend.matchme.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWsController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWsController(
        ChatService chatService,
        SimpMessagingTemplate messagingTemplate
    ) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void send(@Valid ChatSendDTO dto, Principal principal) {
        Long userId = userId(principal);
        ChatService.SendRes res = chatService.send(userId, dto);
        messagingTemplate.convertAndSend("/topic/chat/" + res.msg().getChatId(), res.msg());
        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/chats", res.mine());
        messagingTemplate.convertAndSendToUser(dto.getReceiverId().toString(), "/queue/chats", res.theirs());
    }

    @MessageMapping("/chat.typing")
    public void typing(@Valid TypingDTO dto, Principal principal) {
        Long userId = userId(principal);
        TypingEventDTO event = chatService.typing(userId, dto);
        messagingTemplate.convertAndSendToUser(dto.toId().toString(), "/queue/typing", event);
    }

    private Long userId(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken auth
                && auth.getPrincipal() instanceof Long userId) {
            return userId;
        }
        throw new RuntimeException("Unauthenticated socket");
    }
}
