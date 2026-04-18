package com.backend.matchme.dto.post;

import java.time.LocalDateTime;

public record PostResponseDTO(
    Long id,
    Long authorId,
    String authorNickname,
    String authorImageUrl,
    String content,
    String imageUrl,
    int likesCount,
    LocalDateTime createdAt
) {}
