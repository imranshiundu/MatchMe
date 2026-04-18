package com.backend.matchme.dto.chat;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record TypingDTO(
    @NotNull Long toId,
    boolean typing
) {
}
