package com.backend.matchme.dto.connections;

public record ConnectionResponseDTO(Long userA,
                                    Long userB,
                                    String status) {
}
