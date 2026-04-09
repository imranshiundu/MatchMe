package com.backend.matchme.dto.error;

public record ErrorResponseDTO(
        int status,
        String error,
        String message) {
}
