package com.backend.matchme.dto.connections;

import org.springframework.data.domain.Pageable;

import java.util.List;

public record RecommendationsResponseDTO(List<Long> ids, Pageable pageable) {
}
