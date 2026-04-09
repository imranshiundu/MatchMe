package com.backend.matchme.dto;

public record EditProfileDTO(String nickname,
                             String interest,
                             String bio,
                             Integer age,
                             String gender,
                             String lookingFor,
                             String imageUrl,
                             String publicId) {
}
