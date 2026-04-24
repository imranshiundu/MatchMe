package com.backend.matchme.dto.profile;

import java.util.List;

public record EditProfileDTO(String nickname,
                             List<String> interest,
                             String bio,
                             Integer age,
                             String gender,
                             List<String> lookingFor,
                             String publicId,
                             String location) {
}
