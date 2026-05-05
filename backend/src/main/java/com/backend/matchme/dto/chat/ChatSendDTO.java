package com.backend.matchme.dto.chat;
import lombok.Data;

@Data
public class ChatSendDTO {
    private Long chatId;
    private String content;
}
