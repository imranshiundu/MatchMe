package com.backend.matchme.dto;

public record ProfileResponseDTO(Long id,
                                 String nickname,
                                 String interest,
                                 String bio,
                                 Integer age,
                                 String gender,
                                 String lookingFor) {

}
