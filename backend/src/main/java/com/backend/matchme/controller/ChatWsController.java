package com.backend.matchme.controller;

import com.backend.matchme.dto.chat.ChatSendDTO;
import com.backend.matchme.dto.chat.TypingDTO;
import com.backend.matchme.dto.chat.TypingEventDTO;
import com.backend.matchme.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWsController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWsController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatSendDTO dto, SimpMessageHeaderAccessor headerAccessor) {
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        if (userId == null) return;
        ChatService.SendRes res = chatService.send(userId, dto);

        // Send message to both participants via topic
        messagingTemplate.convertAndSend("/topic/chat/" + dto.getChatId(), res.msg());

        // Update their chat lists
        messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/chats", res.mine());
        messagingTemplate.convertAndSendToUser(res.msg().getReceiverId().toString(), "/queue/chats", res.theirs());
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingDTO dto, SimpMessageHeaderAccessor headerAccessor) {
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        if (userId == null) return;
        TypingEventDTO event = chatService.typing(userId, dto);

        // Find other participant and send typing event
        Long receiverId = chatService.getOtherParticipantId(userId, event.chatId());
        if (receiverId != null) {
            messagingTemplate.convertAndSendToUser(receiverId.toString(), "/queue/typing", event);
        }
    }
}
