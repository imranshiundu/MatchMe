package com.backend.matchme.dto.chat;

import java.util.UUID;

public record TypingEventDTO(
    Long chatId,
    Long fromId,
    boolean typing
) {
}
