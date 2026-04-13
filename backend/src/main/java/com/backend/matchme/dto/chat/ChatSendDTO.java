package com.backend.matchme.dto.chat;
import lombok.Data;
import java.util.UUID;
@Data
public class ChatSendDTO {
    private Long receiverId;
    private String content;
}
