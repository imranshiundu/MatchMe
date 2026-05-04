package com.backend.matchme.dto.post;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostDTO {
    private String content;
    private String type;
    private String codeLanguage;
}
