package com.backend.matchme.dto.connections;

public record ConnectionResponseDTO(Long id,
                                    Long userA,
                                    Long userB,
                                    String status) {
}
