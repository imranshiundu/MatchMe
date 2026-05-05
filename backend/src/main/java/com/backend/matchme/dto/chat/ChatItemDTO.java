package com.backend.matchme.dto.chat;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
@Data
public class ChatItemDTO {
    private Long chatId;
    private Long participantId;
    private String participantName;
    private String participantPicture;
    private String participantBio;
    private boolean participantOnline;
    private String lastMessage;
    private LocalDateTime lastActivity;
    private int unreadCount;
}
