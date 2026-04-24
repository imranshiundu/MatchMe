package com.backend.matchme.dto.profile;

import java.util.List;

public record ProfileResponseDTO(Long id,
                                 String email,
                                 String nickname,
                                 List<String> interest,
                                 String bio,
                                 Integer age,
                                 String gender,
                                 List<String> lookingFor,
                                 String imageUrl,
                                 String publicId,
                                 String location) {
}
