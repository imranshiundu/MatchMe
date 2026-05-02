package com.backend.matchme.controller;
import com.backend.matchme.dto.chat.ChatSendDTO;
import com.backend.matchme.dto.chat.TypingDTO;
import com.backend.matchme.dto.chat.TypingEventDTO;
import com.backend.matchme.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

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
    public void send(@Valid @Payload ChatSendDTO dto, SimpMessageHeaderAccessor headerAccessor) {
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        if (userId == null) {
            throw new RuntimeException("Unauthenticated socket");
        }
        ChatService.SendRes res = chatService.send(userId, dto);
        System.out.println("Sending to /topic/chat/" + res.msg().getChatId());
        messagingTemplate.convertAndSend("/topic/chat/" + res.msg().getChatId(), res.msg());
        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/chats", res.mine());
        messagingTemplate.convertAndSendToUser(dto.getReceiverId().toString(), "/queue/chats", res.theirs());
    }

    @MessageMapping("/chat.typing")
    public void typing(@Valid @Payload TypingDTO dto, SimpMessageHeaderAccessor headerAccessor) {
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        if (userId == null) {
            throw new RuntimeException("Unauthenticated socket");
        }
        TypingEventDTO event = chatService.typing(userId, dto);
        messagingTemplate.convertAndSendToUser(dto.toId().toString(), "/queue/typing", event);
    }
}
