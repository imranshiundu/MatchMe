package com.backend.matchme.dto.post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

public record PostResponseDTO(
        Long id,
        String content,
        String type,
        String codeLanguage,
        LocalDateTime createdAt,
        Long authorId,
        String authorNickname,
        String authorImageUrl,
        Integer likesCount
) {}
