package com.backend.matchme.dto.connections;

import java.util.List;

public record RecommendationsResponseDTO(
        List<Long> ids,
        boolean hasNext,
        boolean hasPrevious
) {}
