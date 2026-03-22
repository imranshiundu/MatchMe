package com.backend.matchme.dto;

public record ErrorResponseDTO(
        int status,
        String error,
        String message) {
}
