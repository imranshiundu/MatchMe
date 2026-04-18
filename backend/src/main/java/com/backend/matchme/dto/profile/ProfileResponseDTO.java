package com.backend.matchme.dto.profile;

public record ProfileResponseDTO(Long id,
                                   String email,
                                   String nickname,
                                   String interest,
                                   String bio,
                                   Integer age,
                                   String gender,
                                   String lookingFor,
                                   String imageUrl,
                                   String publicId,
                                   String location) {
}
