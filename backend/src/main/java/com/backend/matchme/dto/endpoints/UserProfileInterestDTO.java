package com.backend.matchme.dto.endpoints;

import java.util.List;

public record UserProfileInterestDTO(Long id,
                                     List<String> interest) {
}
