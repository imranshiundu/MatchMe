package com.backend.matchme.dto.chat;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
@Data
public class ChatMsgDTO {
    private Long id;
    private Long chatId;
    private Long senderId;
    private Long receiverId;
    private String content;
    private LocalDateTime timestamp;
    private boolean isRead;
}
