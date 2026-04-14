package com.backend.matchme.dto.endpoints;

public record UserSummaryDTO(
        Long id,
        String nickname,
        String imageUrl) {
}
