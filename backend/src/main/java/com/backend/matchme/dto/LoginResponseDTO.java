package com.backend.matchme.dto;

public record LoginResponseDTO(
        String token,
        String email,
        Long id) {
}
