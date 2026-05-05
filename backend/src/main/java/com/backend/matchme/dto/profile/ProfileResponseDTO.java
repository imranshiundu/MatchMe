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
                                 String location,
                                 Double latitude,
                                 Double longitude,
                                 Double radius,
                                 String prompt1,
                                 String answer1,
                                 String prompt2,
                                 String answer2,
                                 String prompt3,
                                 String answer3) {
}
