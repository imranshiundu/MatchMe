package com.backend.matchme.dto.chat;

import jakarta.validation.constraints.NotNull;

public record TypingDTO(
    @NotNull Long chatId,
    boolean isTyping
) {
}
