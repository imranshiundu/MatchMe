package com.backend.matchme.dto.chat;

import java.util.UUID;

public record PresenceDTO(
    Long userId,
    boolean online
) {
}
